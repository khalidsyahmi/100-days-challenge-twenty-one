const mongodb = require("mongodb");

// single object creation
//require db
const db = require('../data/database');

const ObjectId = mongodb.ObjectId;

class Post {
    constructor(title, content, id) {
        this.title = title;
        this.content = content;
        //this.id = id; // may be undefined
        if (id) {
            this.id = new ObjectId(id)
        }
    }

    //3 static function
    static async fetchAll() {
        const posts = await db.getDb().collection("posts").find().toArray();
        return posts;

    }

    //dynamic function
    async fetch() {
        if (!this.id) {
            return;
        }
        const singlePost = await db.getDb().collection("posts").findOne({ _id: this.id });
        //dynamic
        this.title = singlePost.title;
        this.content = singlePost.content;
    }

    //create method 1
    //db is asynchronous
    async save() {
        let resultPost;

        if (this.id) {
            resultPost = await db
                .getDb()
                .collection("posts")
                .updateOne(
                    { _id: this.id },
                    { $set: { title: this.title, content: this.content } }
                );
            return resultPost;
        } else {
            resultPost = await db.getDb().collection("posts").insertOne({
                title: this.title,
                content: this.content,
            });
            return resultPost;//return method to where it is called
        }

    }
    //create method 2
    async delete() {
        if (!this.id) {
            return;
        }
        const postResult = await db.getDb().collection("posts").deleteOne({ _id: this.id });
        return postResult;
    }


}

module.exports = Post;