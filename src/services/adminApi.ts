import { api } from "./api";

export interface PendingCompanies{
    id:string
    name?:string
    email?:string
    role:'COMPANY'
    status:"PENDING"|"ACTIVE"|"SUSPENDED"
    createdAt:string
}

export const adminApi = {
    getPendingCompanies:async ():Promise<{success:boolean;companies:PendingCompanies[]}> => {
        const response = await api.get('/admin/pending-companies')
        return response.data
    },
    verifyCompany:async(data:{userId:string,status:'ACTIVE'|'SUSPENDED'}):Promise<{success:boolean;message:string}>=>{
        const response = await api.post('/admin/verify-company',data)
        return response.data
    }
}