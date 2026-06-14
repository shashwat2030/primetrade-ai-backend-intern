package com.primetrade.bdi.security;

import com.primetrade.bdi.entity.User;
import com.primetrade.bdi.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailService implements UserDetailsService {
    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String identifier) throws UsernameNotFoundException {

        User user = userRepository.findByName(identifier).orElseThrow(() -> new UsernameNotFoundException("Missing User" + identifier));
        return org.springframework.security.core.userdetails.User.builder().username(user.getName()).password(user.getPassword()).roles(user.getRole().name().toUpperCase()).build();


    }
}
