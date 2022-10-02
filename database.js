const { createClient } = require('@supabase/supabase-js')

// Create a single supabase client for interacting with your database
const supabase = createClient('https://tqvqsgobggitvvwffmdo.supabase.co', process.env.API_KEY)

const register = async (email, password) => {
    const { user, session, error } = await supabase.auth.signUp({
        email,
        password
    });
    return { email: user.email, id: user.id };
}

const AddFileToDB = async (location, filename, ip, userid) => {
    const { data, error } = await supabase
    .from('StoredFiles')
    .insert([
        { name: filename, location, userid, uploaderIP: ip}
    ]);
}

module.exports = {
    AddFileToDB,
    register
}