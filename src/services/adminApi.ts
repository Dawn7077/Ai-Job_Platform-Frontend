
import { api } from "./api";

export interface PendingCompanies{
    id:string
    name?:string
    email?:string
    role:'COMPANY'
    status:"PENDING"|"ACTIVE"|"SUSPENDED"
    createdAt:string
}

export interface User{
    id:string
    name?:string
    email:string
    role?:'CANDIDATE'|'COMPANY'|'ADMIN'
    status:"PENDING"|'ACTIVE'|'SUSPENDED'
    createdAt?:string
}

export interface UserFilterParams{
 page?:number
 limit?:number
 role?:string
 status?:string
 search?:string
}
export interface PaginatedUserResponse{
    success:boolean
    users:User[]
    pagination:{
        total:number // total users prisma.users.findmany().count()
        page:number
        totalPages:number
        limit:number
    }
}

export const adminApi = {
    getPendingCompanies:async ():Promise<{success:boolean;companies:PendingCompanies[]}> => {
        const response = await api.get('/admin/pending-companies')
        return response.data
    },
    verifyCompany:async(data:{userId:string,status:'ACTIVE'|'SUSPENDED'}):Promise<{success:boolean;message:string}>=>{
        const response = await api.post('/admin/verify-company',data)
        return response.data
    },
    getUser:async(params:UserFilterParams):Promise<PaginatedUserResponse>=>{
        const response = await api.get('/admin/users',{params})
        return response.data
    },
    updateUserStatus:async(userId:string,status:"PENDING"|'ACTIVE'|'SUSPENDED'):Promise<{success:boolean;message:string}>=>{
        console.log('request sending to update status...',status)
        const response = await api.patch(`/admin/users/${userId}/status`,{status})
        console.log('request send to update status')
        return response.data
    },
    updateUserRole:async(userId:string,role:'CANDIDATE'|'COMPANY'|'ADMIN'):Promise<{success:boolean;message:string}>=>{
        const response = await api.patch(`/admin/users/${userId}/role`,{role})
        return response.data
    },
    deleteUser:async(userId:string):Promise<{success:boolean,message:string}>=>{
        const response = await api.delete(`admin/users/${userId}`)
        return response.data
    }
}