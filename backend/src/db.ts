import mongoose, { Document, Schema, Model, Types } from "mongoose";

export const contentTypes = ["youtube", "twitter"] as const;

interface IUser extends Document {
    _id: Types.ObjectId,
    email: string,
    name: string,
    password: string,
}

interface ITag extends Document {
    _id: Types.ObjectId,
    title: string
}

interface IContent extends Document {
    _id: Types.ObjectId;
    link?: string;
    type: string;
    title: string;
    content?: string;
    tags: string[];
    userId: IUser | Types.ObjectId;
}

interface ILink extends Document {
    _id: Types.ObjectId,
    hash: string,
    userId: IUser | Types.ObjectId,
}

const UserSchema: Schema<IUser> = new Schema({
    email: {type: String, unique: true, required: true},
    name: {type: String, required: true},
    password: {type: String, required: true},
})

const TagSchema: Schema<ITag> = new Schema({
    title: {type: String, unique: true}
})

const ContentSchema = new Schema<IContent>({
    link: { type: String },
    type: { type: String, enum: contentTypes, required: true },
    title: { type: String, required: true },
    content: { type: String },
    tags: [{ type: String, required: true }],
    userId: { type: Types.ObjectId, ref: "user", required: true }
});

const LinkSchema: Schema<ILink> = new Schema({
    hash: {type: String, required: true},
    userId: {type: Types.ObjectId, ref: 'user', required: true, unique: true},
})

const UserModel: Model<IUser> = mongoose.model<IUser>("user", UserSchema);
const TagModel: Model<ITag> = mongoose.model<ITag>("tag", TagSchema);
const ContentModel: Model<IContent> = mongoose.model<IContent>("content", ContentSchema);
const LinkModel: Model<ILink> = mongoose.model<ILink>("link", LinkSchema);

export { UserModel, TagModel, ContentModel, LinkModel };