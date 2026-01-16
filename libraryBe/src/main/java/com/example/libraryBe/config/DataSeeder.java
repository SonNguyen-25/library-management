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
        // Tạo Permission
        if (permissionRepository.count() == 0) {
            for (PermissionEnum permissionEnum : PermissionEnum.values()) {
                Permission permission = Permission.builder()
                        .name(permissionEnum)
                        .description(permissionEnum.getDescription())
                        .build();
                permissionRepository.save(permission);
            }
        }

        // Tạo Role và Gán Permission cụ thể
        if (roleRepository.count() == 0) {
            // Role USER: Không có quyền quản trị
            createRole(RoleEnum.USER, Set.of());

            // Role SUPER_ADMIN
            createRole(RoleEnum.SUPER_ADMIN, Set.of(PermissionEnum.values()));

            // Role LIBRARY_MANAGER (Quản lý sách & Danh mục)
            createRole(RoleEnum.LIBRARY_MANAGER, Set.of(
                    PermissionEnum.BOOK_READ,
                    PermissionEnum.BOOK_CREATE,
                    PermissionEnum.BOOK_UPDATE,
                    PermissionEnum.BOOK_DELETE,
                    PermissionEnum.CATEGORY_MANAGE,
                    PermissionEnum.AUTHOR_MANAGE,
                    PermissionEnum.PUBLISHER_MANAGE
            ));

            // Role USER_MANAGER (Quản lý độc giả)
            createRole(RoleEnum.USER_MANAGER, Set.of(
                    PermissionEnum.USER_READ,
                    PermissionEnum.USER_UPDATE,
                    PermissionEnum.USER_BAN
            ));

            // Role CIRCULATION_MANAGER (Quản lý mượn trả & phạt)
            createRole(RoleEnum.CIRCULATION_MANAGER, Set.of(
                    PermissionEnum.LOAN_READ,
                    PermissionEnum.LOAN_APPROVE,
                    PermissionEnum.LOAN_RETURN,
                    PermissionEnum.FINE_MANAGE
            ));
        }

        // Tạo tài khoản Admin mặc định
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
        if (bookRepository.count() < 5) {
            Author aRobert = createAuthorIfNotFound("Robert C. Martin");
            Author aRowling = createAuthorIfNotFound("J.K. Rowling");
            Author aTolkien = createAuthorIfNotFound("J.R.R. Tolkien");
            Author aMurakami = createAuthorIfNotFound("Haruki Murakami");
            Author aNamCao = createAuthorIfNotFound("Nam Cao");
            Author aDanBrown = createAuthorIfNotFound("Dan Brown");

            Category cIT = createCategoryIfNotFound("Công nghệ thông tin");
            Category cFantasy = createCategoryIfNotFound("Giả tưởng");
            Category cLiterature = createCategoryIfNotFound("Văn học");
            Category cDetective = createCategoryIfNotFound("Trinh thám");
            Category cHorror = createCategoryIfNotFound("Kinh dị");

            Publisher pOReilly = createPublisherIfNotFound("O'Reilly Media");
            Publisher pKimDong = createPublisherIfNotFound("NXB Kim Đồng");
            Publisher pHoiNhaVan = createPublisherIfNotFound("Hội Nhà Văn");
            Publisher pNhaNam = createPublisherIfNotFound("Nhã Nam");

            createBookWithCopy("The Clean Coder", "Quy tắc ứng xử cho lập trình viên chuyên nghiệp.", 4.8,
                    "https://m.media-amazon.com/images/I/51uO-K+W53L._SY445_SX342_.jpg", pOReilly, aRobert, cIT, 5);

            createBookWithCopy("Clean Architecture", "Kiến trúc phần mềm sạch và bền vững.", 4.9,
                    "https://m.media-amazon.com/images/I/41-sN-mzwKL._SY445_SX342_.jpg", pOReilly, aRobert, cIT, 3);

            createBookWithCopy("Harry Potter 1", "Harry Potter và Hòn đá Phù thủy.", 4.9,
                    "https://upload.wikimedia.org/wikipedia/en/6/6b/Harry_Potter_and_the_Philosopher%27s_Stone_Book_Cover.jpg", pKimDong, aRowling, cFantasy, 10);

            createBookWithCopy("Harry Potter 2", "Harry Potter và Phòng chứa Bí mật.", 4.8,
                    "https://upload.wikimedia.org/wikipedia/en/5/5c/Harry_Potter_and_the_Chamber_of_Secrets.jpg", pKimDong, aRowling, cFantasy, 8);

            createBookWithCopy("Harry Potter 3", "Harry Potter và Tên tù nhân ngục Azkaban.", 4.9,
                    "https://upload.wikimedia.org/wikipedia/en/a/a0/Harry_Potter_and_the_Prisoner_of_Azkaban.jpg", pKimDong, aRowling, cFantasy, 6);

            createBookWithCopy("The Hobbit", "Hành trình của Bilbo Baggins.", 4.7,
                    "https://upload.wikimedia.org/wikipedia/en/4/4a/TheHobbit_FirstEdition.jpg", pNhaNam, aTolkien, cFantasy, 4);

            createBookWithCopy("Lord of the Rings 1", "Đoàn hộ nhẫn.", 5.0,
                    "https://upload.wikimedia.org/wikipedia/en/8/8e/The_Fellowship_of_the_Ring_cover.gif", pNhaNam, aTolkien, cFantasy, 5);

            createBookWithCopy("Rừng Na Uy", "Câu chuyện tình yêu và nỗi cô đơn của giới trẻ.", 4.5,
                    "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1386923485i/11297.jpg", pHoiNhaVan, aMurakami, cLiterature, 7);

            createBookWithCopy("Kafka bên bờ biển", "Một tiểu thuyết siêu thực đầy ám ảnh.", 4.6,
                    "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1327872775i/4929.jpg", pNhaNam, aMurakami, cLiterature, 4);

            createBookWithCopy("Chí Phèo", "Tuyển tập truyện ngắn Nam Cao.", 4.9,
                    "https://upload.wikimedia.org/wikipedia/vi/a/ae/Bia-sach-chi-pheo.jpg", pHoiNhaVan, aNamCao, cLiterature, 15);

            createBookWithCopy("Mật mã Da Vinci", "Robert Langdon và bí mật Chén Thánh.", 4.4,
                    "https://upload.wikimedia.org/wikipedia/en/6/6b/DaVinciCode.jpg", pNhaNam, aDanBrown, cDetective, 6);

            createBookWithCopy("Thiên thần và Ác quỷ", "Cuộc chiến giữa Khoa học và Tôn giáo.", 4.3,
                    "https://upload.wikimedia.org/wikipedia/en/e/e9/AngelsAndDemons.jpg", pNhaNam, aDanBrown, cDetective, 5);

            createBookWithCopy("Hỏa Ngục", "Dante và virus sinh học.", 4.1,
                    "https://upload.wikimedia.org/wikipedia/en/e/e3/Inferno_Dan_Brown.jpg", pNhaNam, aDanBrown, cDetective, 8);

            System.out.println("Complete data!");
        }
    }
    private Author createAuthorIfNotFound(String name) {
        return authorRepository.findByName(name)
                .orElseGet(() -> authorRepository.save(new Author(null, name)));
    }

    private Category createCategoryIfNotFound(String name) {
        return categoryRepository.findByName(name)
                .orElseGet(() -> categoryRepository.save(new Category(null, name)));
    }

    private Publisher createPublisherIfNotFound(String name) {
        return publisherRepository.findByName(name)
                .orElseGet(() -> publisherRepository.save(new Publisher(null, name)));
    }

    private void createBookWithCopy(String title, String desc, Double rating, String coverUrl,
                                    Publisher publisher, Author author, Category category, int copyCount) {
        if (bookRepository.findAll().stream().anyMatch(b -> b.getTitle().equals(title))) {
            return;
        }

        Book book = Book.builder()
                .title(title)
                .description(desc)
                .rating(rating)
                .coverUrl(coverUrl)
                .publisher(publisher)
                .authors(new HashSet<>(Set.of(author)))
                .categories(new HashSet<>(Set.of(category)))
                .build();

        Book savedBook = bookRepository.save(book);
        // Tạo các bản copy
        Set<BookCopy> copies = new HashSet<>();
        for (int i = 0; i < copyCount; i++) {
            copies.add(BookCopy.builder()
                    .book(savedBook)
                    .status(BookCopyStatus.AVAILABLE)
                    .condition("New")
                    .build());
        }
        bookCopyRepository.saveAll(copies);
    }
}