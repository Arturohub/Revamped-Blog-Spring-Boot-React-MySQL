package com.arturo.backend.service.blog;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.arturo.backend.DTO.blog.Posts;
import com.arturo.backend.repository.blog.PostsRepository;

@Service
public class PostsService {

    @Autowired
    private PostsRepository postsRepository;

    @Autowired
    private LikesService likesService;

    public List<Posts> getAllPosts(){
        return postsRepository.findAll();
    }

    public Optional<Posts>getPostById(Long id){
        return postsRepository.findById(id);
    }

    public Posts createPost(Posts post) {
        post.setCreatedAt(LocalDateTime.now());
        post.setUpdatedAt(LocalDateTime.now());
        return postsRepository.save(post);
    }

    public Posts updatePost(Long id, Posts postInfo){
        Optional<Posts> optionalPost = postsRepository.findById(id);

        if(optionalPost.isPresent()){
            Posts post = optionalPost.get();
            post.setUserId(postInfo.getUserId());
            post.setTitle(postInfo.getTitle());
            post.setSubtitle(postInfo.getSubtitle());
            post.setContent(postInfo.getContent());
            post.setCategory(postInfo.getCategory());
            post.setImage(postInfo.getImage());
            post.setUpdatedAt(LocalDateTime.now());
            return postsRepository.save(post);
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found with id " + id);
        }   
    }
    
    public void deletePost(Long id) {
        if (postsRepository.existsById(id)) {
            postsRepository.deleteById(id);
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found with id " + id);
        }
    }

    public void likePost(String userId, Long postId) {
        likesService.likePost(userId, postId);
    }

    public Long getLikeCountForPost(Long postId) {
        return likesService.getLikeCountForPost(postId);
    }
}