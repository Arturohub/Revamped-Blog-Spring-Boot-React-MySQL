package com.arturo.backend.repository.auth;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.arturo.backend.DTO.auth.MyUser;

public interface MyUserRepository extends JpaRepository<MyUser, Long>{

    Optional <MyUser> findByUsername(String username);

}
