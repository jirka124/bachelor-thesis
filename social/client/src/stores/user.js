import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    isLogged: false,
    userId: null,
    userName: null,
    userAvatar: null,
    feedPosts: [],
    viewedUserProfile: null,
    viewedUserProfilePosts: [],
    viewedUserProfileFriends: []
  }),
  getters: {},
  actions: {
    setIsLogged(isLogged) {
      this.isLogged = isLogged
    },
    setUserId(userId) {
      this.userId = userId
    },
    setUserName(name) {
      this.userName = name
    },
    setUserAvatar(avatar) {
      this.userAvatar = avatar
    },
    setFeedPosts(posts, likes, likeCounts, replyCounts) {
      posts.map((p) => {
        p.hasLiked = false
        p.likeCount = 0
        p.replyCount = 0
      })

      if (likes && likes.length > 0)
        posts.map((p) => (p.hasLiked = Boolean(likes.find((l) => l.postId === p.postId))))
      if (likeCounts && likeCounts.length > 0)
        posts.map((p) => {
          const likeCount = likeCounts.find((l) => l.postId === p.postId)
          if (likeCount) p.likeCount = likeCount.likeCount
        })
      if (replyCounts && replyCounts.length > 0)
        posts.map((p) => {
          const replyCount = replyCounts.find((l) => l.postId === p.postId)
          if (replyCount) p.replyCount = replyCount.replyCount
        })

      this.feedPosts = posts
    },
    setLikeOnPost(likeObj, route) {
      if (!likeObj) return

      let post
      if (route.name === 'feed') post = this.feedPosts.find((fp) => fp.postId === likeObj.postId)
      else if (route.name === 'view-user')
        post = this.viewedUserProfilePosts.find((fp) => fp.postId === likeObj.postId)

      if (post) {
        likeObj.hasLiked ? post.likeCount++ : post.likeCount--
        post.hasLiked = likeObj.hasLiked
      }
    },
    setPostComments(commentObj, route) {
      if (!commentObj) return

      let post
      if (route.name === 'feed') post = this.feedPosts.find((fp) => fp.postId === commentObj.postId)
      else if (route.name === 'view-user')
        post = this.viewedUserProfilePosts.find((fp) => fp.postId === commentObj.postId)

      if (post) post.comments = commentObj.comments
    },
    addPostComment(commentObj, route) {
      if (!commentObj) return

      let post
      if (route.name === 'feed') post = this.feedPosts.find((fp) => fp.postId === commentObj.postId)
      else if (route.name === 'view-user')
        post = this.viewedUserProfilePosts.find((fp) => fp.postId === commentObj.postId)

      if (post) {
        post.comments.unshift({
          ...commentObj.comment,
          userId: this.userId,
          login: this.userName,
          avatar: this.userAvatar
        })
        post.replyCount++
      }
    },
    setViewedUserProfile(userObj) {
      if (userObj.signupDate) userObj.signupDate = new Date(userObj.signupDate)

      this.viewedUserProfile = userObj
    },
    setViewedUserProfilePosts(posts, likes, likeCounts, replyCounts) {
      posts.map((p) => {
        p.hasLiked = false
        p.likeCount = 0
        p.replyCount = 0
      })

      if (likes && likes.length > 0)
        posts.map((p) => (p.hasLiked = Boolean(likes.find((l) => l.postId === p.postId))))
      if (likeCounts && likeCounts.length > 0)
        posts.map((p) => {
          const likeCount = likeCounts.find((l) => l.postId === p.postId)
          if (likeCount) p.likeCount = likeCount.likeCount
        })
      if (replyCounts && replyCounts.length > 0)
        posts.map((p) => {
          const replyCount = replyCounts.find((l) => l.postId === p.postId)
          if (replyCount) p.replyCount = replyCount.replyCount
        })

      this.viewedUserProfilePosts = posts
    },
    setViewedUserProfileFriends(friends) {
      this.viewedUserProfileFriends = friends
    }
  }
})
