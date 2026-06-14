package com.primetrade.bdi.repository;

import com.primetrade.bdi.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository

public interface TaskRepository extends JpaRepository<Task,Long> {

    List<Task> findByUserId(Long userId);
    List<Task> findByUserName(String name);
    boolean existsByIdAndUserName(Long id, String name);

}
