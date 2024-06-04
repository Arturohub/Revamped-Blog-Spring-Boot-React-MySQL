package com.arturo.backend.controllers.blog;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.arturo.backend.service.blog.LikesService;

@RestController
@RequestMapping("/api")
public class LikesController {

    @Autowired
    private LikesService likesService;

    @GetMapping("/likes/count/{postId}")
    public Long getLikeCountForPost(@PathVariable Long postId) {
        return likesService.getLikeCountForPost(postId);
    }
    
    @PostMapping("/user/likes/{userId}/{postId}")
    public void likePost(@PathVariable String userId, @PathVariable Long postId) {
        likesService.likePost(userId, postId);
    }
}