package com.arturo.backend.controllers.blog;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.arturo.backend.DTO.blog.Posts;
import com.arturo.backend.service.blog.PostsService;

@RestController
@RequestMapping("/api")
public class PostsController {

    @Autowired
    private PostsService postsService;

    @GetMapping("/blog")
    public List<Posts> getAllPosts() {
        try{
            return postsService.getAllPosts();
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Sorry, there was an error retriving the blog posts", e);
        }
      
    }

    @GetMapping("/blog/{id}")
    public ResponseEntity<Posts> getPostsById(@PathVariable Long id){
        
       try {
            Optional<Posts> post = postsService.getPostById(id);
            if (post.isPresent()) {
                return new ResponseEntity<>(post.get(), HttpStatus.OK);
            } else {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found");
            }

        } catch (Exception e) {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error retrieving post with id " + id, e);
        }
    }

    @PostMapping("/admin/blog")
    public ResponseEntity<String> createPost(@RequestBody Posts post) {
        try {
            postsService.createPost(post);
            return new ResponseEntity<>("Blog post created successfully!", HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Sorry, failed to create blog post: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/admin/blog/{id}")
    public ResponseEntity<String> deletePost(@PathVariable Long id) {
        try {
            postsService.deletePost(id);
            return new ResponseEntity<>("Blog post deleted successfully!", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Failed to delete blog post: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/admin/blog/{id}")
    public ResponseEntity<String> updatePost(@PathVariable Long id, @RequestBody Posts post) {
        try {
            Posts updatedPost = postsService.updatePost(id, post);
            if (updatedPost != null) {
                return new ResponseEntity<>("Blog post updated successfully!", HttpStatus.OK);
            } else {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Sorry, post not found");
            }
        } catch (ResponseStatusException e) {
            return new ResponseEntity<>(null, e.getStatusCode());
        } catch (Exception e) {
            return new ResponseEntity<>("Sorry, failed to update blog post: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
