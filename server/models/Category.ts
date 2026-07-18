import mongoose, {type Model} from 'mongoose'

export interface ICategory{
    slug: string
    name:string
    icon:string
}

const CategorySchema = new mongoose.Schema<ICategory>({
    slug:{type:String, required:true, unique:true},
    name:{type:String, required:true},
    icon: {type:String, default:'/images/NonFictionIcon(1).svg'},

})


export const Category:Model<ICategory> = (mongoose.models.Category as Model<ICategory> | undefined) ?? mongoose.model<ICategory>('Category', CategorySchema)