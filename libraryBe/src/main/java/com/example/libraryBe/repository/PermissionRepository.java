package com.example.libraryBe.repository;

import com.example.libraryBe.entity.Permission;
import com.example.libraryBe.model.PermissionEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PermissionRepository extends JpaRepository<Permission, Long> {
    Optional<Permission> findByName(PermissionEnum name);
}
