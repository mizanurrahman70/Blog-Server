import { Blog } from './blog.model';
import { IBlog } from './blog.interface';
import { Types } from 'mongoose';


const createBlogIntoDb = async (data: IBlog): Promise<IBlog> => {
  const blog = await Blog.create(data);
  return blog.populate('author');
}


export const updateBlogInDb = async (
  blogId: string,
  updateParams: Record<string, any>,
  userId: string
) => {

  if (!Types.ObjectId.isValid(blogId)) {
    throw new Error('Invalid blog ID format');
  }

  const blog = await Blog.findOne({ _id: new Types.ObjectId(blogId), author: new Types.ObjectId(userId) });


  if (!blog) {
    throw new Error('Blog not found or you are not authorized to update it');
  }

  Object.assign(blog, updateParams);
  await blog.save();

  const updatedBlog = await Blog.findById(blog._id).populate('author', 'name email');

  return updatedBlog;
};


export const deleteBlogFromDb = async (blogId: string, userId: string) => {
  const blog = await Blog.findOneAndDelete({
    _id: new Types.ObjectId(blogId),
    author: new Types.ObjectId(userId),
  });

  if (!blog) {
    throw new Error('Blog not found or unauthorized access');
  }

  return blog;
};


export const getAllBlogsFromDb = async ({
  search,
  sortBy = 'createdAt',
  sortOrder = 'desc',
  filter,
}: {
  search?: string;
  sortBy?: string;
  sortOrder?: string;
  filter?: string;
}) => {
  const query: Record<string, any> = {};

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } },
    ];
  }

  if (filter) {
    query.author = filter;
  }

  const sortOptions: Record<string, any> = {};
  if (sortBy) {
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
  }

  const blogs = await Blog.find(query).sort(sortOptions).populate('author', 'name email');

  return blogs;
};

export const deleteBlogByAdminFromDb = async (blogId: string) => {
  if (!Types.ObjectId.isValid(blogId)) {
    throw new Error('Invalid blog ID');
  }

  const blog = await Blog.findByIdAndDelete(blogId);

  if (!blog) {
    throw new Error('Blog not found');
  }
};


export const BlogServices = {
  createBlogIntoDb,
  updateBlogInDb,
  deleteBlogFromDb,
  getAllBlogsFromDb,
  deleteBlogByAdminFromDb,
}
