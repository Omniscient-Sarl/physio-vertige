import { db } from "@/db/index";
import { blogPosts } from "@/db/schema";
import { BlogAdmin } from "./client";

export default async function AdminBlogPage() {
  const posts = await db.select().from(blogPosts).orderBy(blogPosts.updatedAt);

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold">Blog</h1>
      <p className="mt-1 text-muted-foreground">Gérez les articles du blog.</p>
      <div className="mt-8">
        <BlogAdmin posts={posts} />
      </div>
    </div>
  );
}
