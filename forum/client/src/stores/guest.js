import { defineStore } from 'pinia'

export const useGuestStore = defineStore('guest', {
  state: () => ({
    trendingPosts: [],
    searchedPosts: [],
    viewedPost: null
  }),
  actions: {
    setTrendingPosts(posts, views, replies) {
      if (views && views.length > 0) {
        posts.map((p) => {
          const view = views.find((v) => v.postId === p.postId)
          p.viewCount = view ? view.viewCount : 0
        })
      }
      if (replies && replies.length > 0) {
        posts.map((p) => {
          const reply = replies.find((r) => r.postId === p.postId)
          p.replyCount = reply ? reply.replyCount : 0
        })
      }

      this.trendingPosts = posts
    },
    setSearchedPosts(posts, views, replies) {
      if (views && views.length > 0) {
        posts.map((p) => {
          const view = views.find((v) => v.postId === p.postId)
          p.viewCount = view ? view.viewCount : 0
        })
      }
      if (replies && replies.length > 0) {
        posts.map((p) => {
          const reply = replies.find((r) => r.postId === p.postId)
          p.replyCount = reply ? reply.replyCount : 0
        })
      }

      this.searchedPosts = posts
    },
    setViewedPost(post) {
      this.viewedPost = post
    },
    alterViewedPost(post) {
      if (post.hasOwnProperty('viewCount')) this.viewedPost.viewCount = post.viewCount
      if (post.hasOwnProperty('replyCount')) this.viewedPost.replyCount = post.replyCount
    },
    addViewedReply(reply) {
      if (this.viewedPost && this.viewedPost.postId === reply.postId) {
        const replyIn = this.viewedPost.replies.find((r) => r.postReplyId === reply.postReplyId)
        if (!replyIn) this.viewedPost.replies.unshift(reply)
      }
    }
  }
})
