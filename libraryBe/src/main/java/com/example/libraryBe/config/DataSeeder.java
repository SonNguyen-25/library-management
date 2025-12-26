package com.example.libraryBe.config;

import com.example.libraryBe.entity.*;
import com.example.libraryBe.model.*;
import com.example.libraryBe.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthorRepository authorRepository;
    private final CategoryRepository categoryRepository;
    private final PublisherRepository publisherRepository;
    private final BookRepository bookRepository;
    private final BookCopyRepository bookCopyRepository;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        seedRolesAndUsers();
        seedBooks();
    }

    private void seedRolesAndUsers() {
        if (permissionRepository.count() == 0) {
            for (PermissionEnum permissionEnum : PermissionEnum.values()) {
                Permission permission = Permission.builder()
                        .name(permissionEnum)
                        .description(permissionEnum.getDescription())
                        .build();
                permissionRepository.save(permission);
            }
        }

        if (roleRepository.count() == 0) {
            createRole(RoleEnum.USER, Set.of());
            createRole(RoleEnum.SUPER_ADMIN, Set.of(PermissionEnum.values()));
        }

        if (!userRepository.existsByUsername("admin")) {
            Role adminRole = roleRepository.findByName(RoleEnum.SUPER_ADMIN).orElseThrow();
            User admin = User.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("password"))
                    .name("Super Administrator")
                    .email("admin@library.com")
                    .status("Active")
                    .avatarUrl("https://ui-avatars.com/api/?name=Super+Admin")
                    .joinedDate(LocalDateTime.now())
                    .roles(new HashSet<>(Set.of(adminRole)))
                    .build();
            userRepository.save(admin);
        }
    }
    private void createRole(RoleEnum roleName, Set<PermissionEnum> permissionEnums) {
        Role role = Role.builder().name(roleName).description(roleName.name()).permissions(new HashSet<>()).build();
        for (PermissionEnum pEnum : permissionEnums) {
            permissionRepository.findByName(pEnum).ifPresent(p -> role.getPermissions().add(p));
        }
        roleRepository.save(role);
    }

    private void seedBooks() {
        if (bookRepository.count() == 0) {
            System.out.println("Đang khởi tạo dữ liệu Sách mẫu...");

            Author author1 = new Author(null, "Robert C. Martin");
            Author author2 = new Author(null, "J.K. Rowling");
            authorRepository.saveAll(Set.of(author1, author2));

            Category catIT = new Category(null, "Công nghệ thông tin");
            Category catFantasy = new Category(null, "Giả tưởng");
            categoryRepository.saveAll(Set.of(catIT, catFantasy));

            Publisher pub1 = new Publisher(null, "NXB Trẻ");
            Publisher pub2 = new Publisher(null, "O'Reilly Media");
            publisherRepository.saveAll(Set.of(pub1, pub2));

            Book book1 = Book.builder()
                    .title("Clean Code")
                    .description("Cuốn sách gối đầu giường cho mọi lập trình viên.")
                    .rating(5.0)
                    .coverUrl("https://m.media-amazon.com/images/I/41xShlnTZTL._SX376_BO1,204,203,200_.jpg")
                    .publisher(pub2)
                    .authors(new HashSet<>(Set.of(author1)))
                    .categories(new HashSet<>(Set.of(catIT)))
                    .build();

            Book book2 = Book.builder()
                    .title("Harry Potter và Hòn đá Phù thủy")
                    .description("Cậu bé phù thủy với vết sẹo hình tia chớp.")
                    .rating(4.8)
                    .coverUrl("https://upload.wikimedia.org/wikipedia/en/6/6b/Harry_Potter_and_the_Philosopher%27s_Stone_Book_Cover.jpg")
                    .publisher(pub1)
                    .authors(new HashSet<>(Set.of(author2)))
                    .categories(new HashSet<>(Set.of(catFantasy)))
                    .build();

            bookRepository.saveAll(Set.of(book1, book2));

            BookCopy copy1 = BookCopy.builder().book(book1).status(BookCopyStatus.AVAILABLE).condition("New").build();
            BookCopy copy2 = BookCopy.builder().book(book1).status(BookCopyStatus.AVAILABLE).condition("Good").build();
            BookCopy copy3 = BookCopy.builder().book(book2).status(BookCopyStatus.AVAILABLE).condition("Worn").build();

            bookCopyRepository.saveAll(Set.of(copy1, copy2, copy3));

            System.out.println("Send book complete!");
        }
    }
}