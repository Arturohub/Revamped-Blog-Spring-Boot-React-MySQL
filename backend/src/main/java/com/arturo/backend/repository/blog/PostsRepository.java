package com.arturo.backend.repository.blog;
import org.springframework.data.jpa.repository.JpaRepository;
import com.arturo.backend.DTO.blog.Posts;

public interface PostsRepository extends JpaRepository <Posts, Long>{


}
