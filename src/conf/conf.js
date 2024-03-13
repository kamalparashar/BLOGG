//Better practice 
// as it confirms string datatype and also 
// we do not have to write whole import.meta.env.--- again and again
const conf = {
        appwriteUrl: String(import.meta.env.VITE_APPWRITE_URL),
        appwriteProjectId: String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
        appwriteDatabaseId: String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
        appwriteCollectionId: String(import.meta.env.VITE_APPWRITE_COLLECTION_ID),
        appwriteBucketId: String(import.meta.env.VITE_APPWRITE_BUCKET_ID),
        RTE_KEY:String(import.meta.env.VITE_RTE_KEY),
}

export default conf;