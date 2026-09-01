import PocketBase from 'pocketbase'

const pb = new PocketBase(process.env.POCKETBASE_URL)
pb.autoCancellation(false)

let authPromise = null

const connect = async () => {
    if (!authPromise) {
        authPromise = pb.collection('_superusers').authWithPassword(
            process.env.POCKETBASE_ADMIN_EMAIL,
            process.env.POCKETBASE_ADMIN_PASSWORD
        ).then(() => {
            console.log('database connected sucessfuly')
        }).catch((err) => {
            authPromise = null
            throw err
        })
    }
    return authPromise
}

const ensureAuth = async () => {
    if (!pb.authStore.isValid) {
        await connect()
    }
}

export default connect
export {
    pb,
    ensureAuth
}
