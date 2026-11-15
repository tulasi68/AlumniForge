// Prototype authentication and registration workflow. Real OTP and authorization require a trusted server.
export type Role = "admin" | "alumni";
export type User = { id:string; name:string; email:string; phone:string; role:Role; batch?:string; department?:string; rollNumber?:string; college?:string; hostel?:string; company?:string; photo?:string|null; offerMentorship?:boolean; seekMentorship?:boolean; };
export type RegistrationRequest = { id:string; name:string; phone:string; batch:string; department:string; rollNumber:string; requestedAt:string; };
const STORAGE_KEY="alumniforge_user", USERS_KEY="alumniforge_users", PENDING_KEY="alumniforge_pending_registrations";
// Owner-managed allowlist. Add up to two more approved admin numbers here.
export const ADMIN_PHONE_ALLOWLIST=["1234"];
const norm=(value:string)=>value.replace(/\D/g,"");
function getSavedUsers():User[]{if(typeof window==="undefined")return[];try{return JSON.parse(localStorage.getItem(USERS_KEY)||"[]") as User[]}catch{return[]}}
function saveUsers(users:User[]){localStorage.setItem(USERS_KEY,JSON.stringify(users))}
function rememberUser(user:User){const phone=norm(user.phone||"");saveUsers([...getSavedUsers().filter(u=>norm(u.phone||"")!==phone),user])}
export function getCurrentUser():User|null{if(typeof window==="undefined")return null;try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||"null") as User|null}catch{return null}}
export function setCurrentUser(user:User|null){if(typeof window==="undefined")return;if(user){rememberUser(user);localStorage.setItem(STORAGE_KEY,JSON.stringify(user))}else localStorage.removeItem(STORAGE_KEY)}
export function updateCurrentUser(updates:Partial<User>){const current=getCurrentUser();if(!current)return null;const updated={...current,...updates};setCurrentUser(updated);return updated}
export function getUsers(){return getSavedUsers()}
export function getPendingRegistrations():RegistrationRequest[]{if(typeof window==="undefined")return[];try{return JSON.parse(localStorage.getItem(PENDING_KEY)||"[]") as RegistrationRequest[]}catch{return[]}}
export function submitRegistrationRequest(input:Omit<RegistrationRequest,"id"|"requestedAt">){
 const phone=norm(input.phone);
 if(getSavedUsers().some(u=>norm(u.phone||"")===phone))return{ok:false as const,message:"This phone number is already registered. Please use alumni login."};
 const pending=getPendingRegistrations();
 if(pending.some(r=>norm(r.phone)===phone))return{ok:false as const,message:"A request for this phone number is already awaiting approval."};
 localStorage.setItem(PENDING_KEY,JSON.stringify([{...input,phone,id:"request-"+Date.now(),requestedAt:new Date().toISOString()},...pending]));
 return{ok:true as const};
}
export function approveRegistration(requestId:string):User|null{
 if(getCurrentUser()?.role!=="admin")return null;
 const pending=getPendingRegistrations(),request=pending.find(r=>r.id===requestId);if(!request)return null;
 const user:User={id:"user-"+Date.now(),name:request.name,phone:norm(request.phone),email:"",role:"alumni",batch:request.batch,department:request.department,rollNumber:request.rollNumber,college:"",offerMentorship:false,seekMentorship:false};
 rememberUser(user);localStorage.setItem(PENDING_KEY,JSON.stringify(pending.filter(r=>r.id!==requestId)));return user;
}
export function rejectRegistration(requestId:string){if(getCurrentUser()?.role!=="admin")return false;const pending=getPendingRegistrations();if(!pending.some(r=>r.id===requestId))return false;localStorage.setItem(PENDING_KEY,JSON.stringify(pending.filter(r=>r.id!==requestId)));return true}
export function loginApprovedUser(phoneInput:string):User|null{const phone=norm(phoneInput),user=getSavedUsers().find(u=>u.role==="alumni"&&norm(u.phone||"")===phone);if(!user)return null;setCurrentUser(user);return user}
export function loginAdmin(phoneInput:string):User|null{
 const phone=norm(phoneInput);if(!ADMIN_PHONE_ALLOWLIST.map(norm).includes(phone))return null;
 const existing=getSavedUsers().find(u=>u.role==="admin"&&norm(u.phone||"")===phone);
 const admin:User=existing||{id:"admin-"+phone,name:"Application Owner",phone,email:"",role:"admin",college:""};
 rememberUser(admin);setCurrentUser(admin);return admin;
}
export function deleteUser(userId:string):User[]{const admin=getCurrentUser();if(admin?.role!=="admin"||admin.id===userId)return getSavedUsers();const remaining=getSavedUsers().filter(u=>u.id!==userId);saveUsers(remaining);try{const raw=localStorage.getItem("alumniforge_mentorship_profiles");if(raw){const profiles=JSON.parse(raw) as Array<{id?:string}>;localStorage.setItem("alumniforge_mentorship_profiles",JSON.stringify(profiles.filter(p=>p.id!==userId)))}}catch(e){console.error("Unable to clean up mentorship profile:",e)}return remaining}
export function logout(){setCurrentUser(null)}
