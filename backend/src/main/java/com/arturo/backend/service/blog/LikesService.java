package com.arturo.backend.service.blog;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.arturo.backend.DTO.auth.MyUser;
import com.arturo.backend.DTO.blog.Likes;
import com.arturo.backend.DTO.blog.Posts;
import com.arturo.backend.repository.auth.MyUserRepository;
import com.arturo.backend.repository.blog.LikesRepository;
import com.arturo.backend.repository.blog.PostsRepository;

@Service
public class LikesService {

    @Autowired
    private LikesRepository likesRepository;

    @Autowired
    private PostsRepository postsRepository;

    @Autowired
    private MyUserRepository myUserRepository;

    public Long getLikeCountForPost(Long postId) {
        Optional<Posts> postOptional = postsRepository.findById(postId);
        if (postOptional.isPresent()) {
            Posts post = postOptional.get();
            return likesRepository.countLikesByPostId(post);
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found");
        }
    }

    public void likePost(String userId, Long postId) {
        Optional<MyUser> userOptional = myUserRepository.findByUsername(userId);
        Optional<Posts> postOptional = postsRepository.findById(postId);
    
        if (userOptional.isPresent() && postOptional.isPresent()) {
            MyUser user = userOptional.get();
            Posts post = postOptional.get();
    
            if (likesRepository.existsByUserIdAndPostId(user, post)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "You already liked this post!");
            } else {
                Likes like = new Likes();
                like.setUserId(user);
                like.setPostId(post);
                like.setCreatedAt(LocalDateTime.now());
    
                likesRepository.save(like);
            }
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User or Post not found");
        }
    }
}