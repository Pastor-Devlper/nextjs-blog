import Head from 'next/head';
import { Fragment } from 'react';
import { getPostData, getAllPosts } from '../../../lib/db-util';
import PostContent from '../../../components/posts/post-detail/post-content';

function PostDetailPage(props) {
  return (
    <Fragment>
      <Head>
        <title>{props.post.title}</title>
        <meta name="description" content={props.post.excerpt} />
      </Head>
      <PostContent post={props.post} />
    </Fragment>
  );
}

export async function getStaticProps(context) {
  const { params } = context;
  const postId = params.postId;
  const postData = await getPostData(postId);

  return {
    props: { post: postData },
    revalidate: 600,
  };
}

export async function getStaticPaths() {
  // const postFileNames = getPostsFiles();
  // const slugs = postFileNames.map((fileName) => fileName.replace(/\.md$/, ''));

  // return {
  //   paths: slugs.map((slug) => ({ params: { slug: slug } })),
  //   fallback: false,
  // };
  const postsData = await getAllPosts();
  const postIds = postsData.map((post) => ({
    params: { postId: post.postId },
  }));

  return {
    paths: postIds,
    fallback: 'blocking',
  };
}

export default PostDetailPage;
