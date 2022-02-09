const bcrypt = require('bcryptjs');
const db = require('../data/database');

class User {
    constructor(email, password) {
        this.email = email;
        this.password = password;
    }

    //1
    async getSameUserMail() {
        //no validations
        //not tied to a specific id
        const existingUser = await db
            .getDb()
            .collection("users")
            .findOne({ email: this.email });
        return existingUser;
    }

    //custom internal check
    //ultimate return a boolean for if statement in the next validation
    //why does it only apply here?
    //uses this.
    async existsAlready() {
        const existingUser = await this.getSameUserMail();
        if (existingUser) {
            return true;
        } else {
            return false;
        }
    }

    //2
    async signup() {
        const hashedPassword = await bcrypt.hash(this.password, 12);

        const result = await db.getDb().collection('users').insertOne({
            email: this.email,
            password: hashedPassword,
        });

        return result;
    }

    //3
    async login(comparePassword) {
        const passwordsAreEqual = await bcrypt.compare(
            this.password,
            comparePassword
        );
        return passwordsAreEqual;
    }

}

module.exports = User;

