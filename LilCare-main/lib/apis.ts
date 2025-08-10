import axios from "axios";


export const postImage = async ( args : {file : File}) : Promise<{ url : string, type: string, name: string, size: number}> => {
    const formData = new FormData();
    formData.append('file', args.file);
    return (await axios.post<{ url : string, type: string, name: string, size: number}>(`/api/images`, formData, { headers : { "Content-Type" : "application/multipart"}})).data
}