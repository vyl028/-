import request from '@/utils/request'

export const getArticleDetail = (id) => {
  return request({
    url: `/api/articles/${id}`,
    method: 'get'
  })
}

export const followAuthor = (authorId) => {
  return request({
    url: `/api/users/${authorId}/follow`,
    method: 'post'
  })
}

export const addComment = (articleId, data) => {
  return request({
    url: `/api/articles/${articleId}/comments`,
    method: 'post',
    data
  })
}

export const shareArticle = (articleId) => {
  return request({
    url: `/api/articles/${articleId}/share`,
    method: 'post'
  })
} 