const { createClient } = require('@supabase/supabase-js')
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxdnFzZ29iZ2dpdHZ2d2ZmbWRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY2NDYzODYwMSwiZXhwIjoxOTgwMjE0NjAxfQ.fNR66J2d1LoHMnr2xct_czUlrY_EY7z8bDV4nJ2Strk
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