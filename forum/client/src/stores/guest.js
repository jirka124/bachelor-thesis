import { defineStore } from 'pinia'

export const useGuestStore = defineStore('guest', {
  state: () => ({
    trendingPosts: [],
    searchedPosts: [],
    viewedPost: null
  }),
  actions: {
    setTrendingPosts(posts) {
      this.trendingPosts = posts
    },
    setSearchedPosts(posts) {
      this.searchedPosts = posts
    },
    setViewedPost(post) {
      this.viewedPost = post
    },
    addViewedReply(reply) {
      if (this.viewedPost && this.viewedPost.postId === reply.postId) {
        const replyIn = this.viewedPost.replies.find((r) => r.postReplyId === reply.postReplyId)
        if (!replyIn) this.viewedPost.replies.unshift(reply)
      }
    }
  }
})
