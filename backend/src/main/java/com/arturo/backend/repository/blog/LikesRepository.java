package com.arturo.backend.repository.blog;

import org.springframework.data.jpa.repository.JpaRepository;

import com.arturo.backend.DTO.auth.MyUser;
import com.arturo.backend.DTO.blog.Likes;
import com.arturo.backend.DTO.blog.Posts;

public interface LikesRepository extends JpaRepository<Likes, Long>{
    Long countLikesByPostId(Posts post);

    boolean existsByUserIdAndPostId(MyUser user, Posts post);
    
}
