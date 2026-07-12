--
-- Create DB
--

CREATE DATABASE IF NOT EXISTS lilact_php_demo CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE lilact_php_demo;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

--
-- Create Tables
--
CREATE TABLE `items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` varchar(4096) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE `users` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Demo Data
--

INSERT INTO `users` (`id`, `username`, `password_hash`, `created_at`, `updated_at`) VALUES
(3, 'test-user-1', '25d55ad283aa400af464c76d713c07ad', '2026-07-11 22:27:35', NULL),
(4, 'test-user-2', '25d55ad283aa400af464c76d713c07ad', '2026-07-11 22:29:46', NULL);

INSERT INTO `items` (`id`, `title`, `content`, `created_by`, `created_at`) VALUES
(11, 'What JSX Brings to PHP Projects', 'JSX lets you write UI structures in a clear, component-based style, which can pair nicely with PHP-driven backends. In a typical PHP app, PHP can handle routing, authentication, and server-side rendering needs (if you choose), while JSX helps keep frontend markup readable and organized. The result is a smoother split of responsibilities: PHP for data and logic, JSX for expressive UI.', 3, '2026-07-11 22:28:08'),
(12, 'Better Component Reuse and Maintainability', 'Using JSX encourages building reusable components that you can compose to create complex interfaces without duplicating markup. When integrated into a PHP workflow (for example, via a Lilact), those components become a maintainable foundation for your UI. That reuse reduces bugs, makes updates faster, and keeps your presentation layer consistent across pages.', 3, '2026-07-11 22:28:37'),
(13, 'Stronger Developer Experience with Readable Markup', 'JSX feels familiar to anyone who already understands HTML, but it adds the power to embed JavaScript logic directly where UI is defined. This improves readability compared to scattered template code, especially when you need conditional rendering or dynamic lists. In a PHP context, that means less glue code and fewer places to hunt when you want to change how something looks based on server-provided data.', 3, '2026-07-11 22:29:32'),
(14, 'Clearer Data-to-UI Mapping with Props', 'JSX makes it straightforward to pass data into UI via props, which fits naturally with PHP’s job of producing structured data (arrays, JSON, view models). Once your PHP backend outputs the right data, your JSX components can render it predictably. This leads to a clean “data in, UI out” model that’s easier to test and reason about.', 4, '2026-07-11 22:30:11'),
(15, 'More Flexible UI Evolution Over Time', 'Starting with JSX helps you progressively enhance your UI because components can grow as requirements change. In a PHP application, you can keep core pages working while upgrading specific parts of the frontend to more interactive experiences. That incremental approach reduces rewrite risk and helps teams move toward modern UI patterns without disrupting existing PHP features.', 4, '2026-07-11 22:30:28');

COMMIT;

