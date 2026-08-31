import PocketBase from 'pocketbase'

const pb = new PocketBase(process.env.POCKETBASE_URL)
pb.autoCancellation(false)

const connect = async () => {
    try {
        await pb.collection('_superusers').authWithPassword(
            process.env.POCKETBASE_ADMIN_EMAIL,
            process.env.POCKETBASE_ADMIN_PASSWORD
        )
        console.log('database connected sucessfuly')
    } catch (err) {
        console.log(err)
    }
}

export default connect
export {
    pb
}
