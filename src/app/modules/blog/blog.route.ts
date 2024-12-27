import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { BlogControllers } from './blog.controller';
import { blogValidationSchema, updateBlogValidationSchema } from './block.validation';
import { authMiddleware } from '../../middlewares/authMiddleware';

const router = express.Router();

router.post('/blogs', authMiddleware.userAuthMiddleware, validateRequest(blogValidationSchema), BlogControllers.createBlog);

router.patch('/blogs/:id', authMiddleware.userAuthMiddleware,validateRequest(updateBlogValidationSchema), BlogControllers.updateBlog);

router.delete('/blogs/:id', authMiddleware.userAuthMiddleware, BlogControllers.deleteBlog);

router.get('/blogs', BlogControllers.getAllBlogs);

router.delete('/admin/blogs/:id', authMiddleware.userAuthMiddleware, authMiddleware.adminAuthMiddleware, BlogControllers.deleteBlogByAdmin);


export const BlogRoutes = router;
