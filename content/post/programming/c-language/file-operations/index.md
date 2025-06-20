---
title: "C语言文件操作详解"
description: "全面介绍C语言中的文件读写操作，包含实例代码和最佳实践"
date: 2025-01-19T11:00:00+08:00
lastmod: 2025-01-19T11:00:00+08:00
draft: false
slug: "c-language-file-operations"
categories:
  - "Programming"
  - "C Language"
tags:
  - "c-language"
  - "file-operations"
  - "tutorial"
  - "intermediate"
image: ""
weight: 80
toc: true
math: false
license: "CC BY-NC-SA 4.0"
---

# C语言文件操作详解

## 概述

文件操作是C语言编程中的重要组成部分，它允许程序与外部文件进行数据交换。本文将详细介绍C语言中的文件操作方法，包括文件的打开、读取、写入和关闭等操作。

## 文件操作基础

### 1. 文件指针

在C语言中，文件操作通过文件指针来实现。文件指针是一个指向FILE结构的指针：

```c
FILE *fp;  // 声明文件指针
```

### 2. 文件操作流程

标准的文件操作流程包括：
1. 打开文件
2. 读取或写入数据
3. 关闭文件

## 文件打开与关闭

### 1. fopen() 函数

```c
FILE *fopen(const char *filename, const char *mode);
```

**参数说明**：
- `filename`：文件名（包含路径）
- `mode`：文件打开模式

**常用模式**：

| 模式 | 说明 | 文件不存在时 | 文件存在时 |
|------|------|-------------|-----------|
| "r" | 只读 | 返回NULL | 从头开始读 |
| "w" | 只写 | 创建新文件 | 清空内容 |
| "a" | 追加写 | 创建新文件 | 从末尾写入 |
| "r+" | 读写 | 返回NULL | 从头开始 |
| "w+" | 读写 | 创建新文件 | 清空内容 |
| "a+" | 读写追加 | 创建新文件 | 从末尾写入 |

**示例**：

```c
#include <stdio.h>
#include <stdlib.h>

int main() {
    FILE *fp;
    
    // 打开文件进行写入
    fp = fopen("example.txt", "w");
    if (fp == NULL) {
        printf("无法打开文件\n");
        return 1;
    }
    
    printf("文件打开成功\n");
    
    // 关闭文件
    fclose(fp);
    return 0;
}
```

### 2. fclose() 函数

```c
int fclose(FILE *fp);
```

- 成功关闭返回0
- 失败返回EOF

## 文件写入操作

### 1. fputc() - 写入单个字符

```c
int fputc(int c, FILE *fp);
```

**示例**：

```c
#include <stdio.h>

int main() {
    FILE *fp;
    char ch;
    
    fp = fopen("output.txt", "w");
    if (fp == NULL) {
        printf("无法创建文件\n");
        return 1;
    }
    
    // 写入字符
    for (ch = 'A'; ch <= 'Z'; ch++) {
        fputc(ch, fp);
    }
    
    fclose(fp);
    printf("字符写入完成\n");
    return 0;
}
```

### 2. fputs() - 写入字符串

```c
int fputs(const char *str, FILE *fp);
```

**示例**：

```c
#include <stdio.h>

int main() {
    FILE *fp;
    
    fp = fopen("message.txt", "w");
    if (fp == NULL) {
        printf("无法创建文件\n");
        return 1;
    }
    
    fputs("Hello, World!\n", fp);
    fputs("这是第二行\n", fp);
    
    fclose(fp);
    printf("字符串写入完成\n");
    return 0;
}
```

### 3. fprintf() - 格式化写入

```c
int fprintf(FILE *fp, const char *format, ...);
```

**示例**：

```c
#include <stdio.h>

int main() {
    FILE *fp;
    int num = 42;
    float pi = 3.14159;
    char name[] = "张三";
    
    fp = fopen("data.txt", "w");
    if (fp == NULL) {
        printf("无法创建文件\n");
        return 1;
    }
    
    fprintf(fp, "姓名: %s\n", name);
    fprintf(fp, "整数: %d\n", num);
    fprintf(fp, "浮点数: %.2f\n", pi);
    
    fclose(fp);
    printf("格式化数据写入完成\n");
    return 0;
}
```

### 4. fwrite() - 二进制写入

```c
size_t fwrite(const void *ptr, size_t size, size_t count, FILE *fp);
```

**示例**：

```c
#include <stdio.h>

struct Student {
    int id;
    char name[50];
    float score;
};

int main() {
    FILE *fp;
    struct Student students[] = {
        {1, "张三", 85.5},
        {2, "李四", 92.0},
        {3, "王五", 78.5}
    };
    
    fp = fopen("students.dat", "wb");
    if (fp == NULL) {
        printf("无法创建文件\n");
        return 1;
    }
    
    // 写入结构体数组
    size_t written = fwrite(students, sizeof(struct Student), 3, fp);
    printf("写入了 %zu 个学生记录\n", written);
    
    fclose(fp);
    return 0;
}
```

## 文件读取操作

### 1. fgetc() - 读取单个字符

```c
int fgetc(FILE *fp);
```

**示例**：

```c
#include <stdio.h>

int main() {
    FILE *fp;
    int ch;
    
    fp = fopen("output.txt", "r");
    if (fp == NULL) {
        printf("无法打开文件\n");
        return 1;
    }
    
    printf("文件内容: ");
    while ((ch = fgetc(fp)) != EOF) {
        putchar(ch);
    }
    printf("\n");
    
    fclose(fp);
    return 0;
}
```

### 2. fgets() - 读取字符串

```c
char *fgets(char *str, int n, FILE *fp);
```

**示例**：

```c
#include <stdio.h>

int main() {
    FILE *fp;
    char line[100];
    
    fp = fopen("message.txt", "r");
    if (fp == NULL) {
        printf("无法打开文件\n");
        return 1;
    }
    
    printf("文件内容:\n");
    while (fgets(line, sizeof(line), fp) != NULL) {
        printf("%s", line);
    }
    
    fclose(fp);
    return 0;
}
```

### 3. fscanf() - 格式化读取

```c
int fscanf(FILE *fp, const char *format, ...);
```

**示例**：

```c
#include <stdio.h>

int main() {
    FILE *fp;
    char name[50];
    int num;
    float pi;
    
    fp = fopen("data.txt", "r");
    if (fp == NULL) {
        printf("无法打开文件\n");
        return 1;
    }
    
    // 跳过标签，只读取数据
    fscanf(fp, "姓名: %s", name);
    fscanf(fp, "整数: %d", &num);
    fscanf(fp, "浮点数: %f", &pi);
    
    printf("读取的数据:\n");
    printf("姓名: %s\n", name);
    printf("整数: %d\n", num);
    printf("浮点数: %.2f\n", pi);
    
    fclose(fp);
    return 0;
}
```

### 4. fread() - 二进制读取

```c
size_t fread(void *ptr, size_t size, size_t count, FILE *fp);
```

**示例**：

```c
#include <stdio.h>

struct Student {
    int id;
    char name[50];
    float score;
};

int main() {
    FILE *fp;
    struct Student student;
    
    fp = fopen("students.dat", "rb");
    if (fp == NULL) {
        printf("无法打开文件\n");
        return 1;
    }
    
    printf("学生信息:\n");
    while (fread(&student, sizeof(struct Student), 1, fp) == 1) {
        printf("ID: %d, 姓名: %s, 成绩: %.1f\n", 
               student.id, student.name, student.score);
    }
    
    fclose(fp);
    return 0;
}
```

## 文件定位操作

### 1. fseek() - 设置文件位置

```c
int fseek(FILE *fp, long offset, int whence);
```

**参数说明**：
- `offset`：偏移量
- `whence`：起始位置
  - `SEEK_SET`：文件开头
  - `SEEK_CUR`：当前位置
  - `SEEK_END`：文件末尾

### 2. ftell() - 获取当前位置

```c
long ftell(FILE *fp);
```

### 3. rewind() - 回到文件开头

```c
void rewind(FILE *fp);
```

**示例**：

```c
#include <stdio.h>

int main() {
    FILE *fp;
    char ch;
    long pos;
    
    fp = fopen("example.txt", "w+");
    if (fp == NULL) {
        printf("无法创建文件\n");
        return 1;
    }
    
    // 写入一些数据
    fputs("Hello World", fp);
    
    // 获取当前位置
    pos = ftell(fp);
    printf("当前位置: %ld\n", pos);
    
    // 回到文件开头
    rewind(fp);
    
    // 读取数据
    printf("文件内容: ");
    while ((ch = fgetc(fp)) != EOF) {
        putchar(ch);
    }
    printf("\n");
    
    // 定位到文件中间
    fseek(fp, 6, SEEK_SET);
    printf("从位置6开始: ");
    while ((ch = fgetc(fp)) != EOF) {
        putchar(ch);
    }
    printf("\n");
    
    fclose(fp);
    return 0;
}
```

## 错误处理

### 1. 检查文件操作错误

```c
#include <stdio.h>
#include <errno.h>
#include <string.h>

int main() {
    FILE *fp;
    
    fp = fopen("nonexistent.txt", "r");
    if (fp == NULL) {
        printf("错误: %s\n", strerror(errno));
        return 1;
    }
    
    // 文件操作...
    
    fclose(fp);
    return 0;
}
```

### 2. feof() 和 ferror()

```c
#include <stdio.h>

int main() {
    FILE *fp;
    int ch;
    
    fp = fopen("test.txt", "r");
    if (fp == NULL) {
        printf("无法打开文件\n");
        return 1;
    }
    
    while ((ch = fgetc(fp)) != EOF) {
        putchar(ch);
        
        // 检查错误
        if (ferror(fp)) {
            printf("读取错误\n");
            break;
        }
    }
    
    // 检查是否到达文件末尾
    if (feof(fp)) {
        printf("已到达文件末尾\n");
    }
    
    fclose(fp);
    return 0;
}
```

## 实际应用示例

### 1. 文本文件处理程序

```c
#include <stdio.h>
#include <string.h>

// 统计文件中的行数、字数和字符数
void count_file_stats(const char *filename) {
    FILE *fp;
    int lines = 0, words = 0, chars = 0;
    int ch, in_word = 0;
    
    fp = fopen(filename, "r");
    if (fp == NULL) {
        printf("无法打开文件: %s\n", filename);
        return;
    }
    
    while ((ch = fgetc(fp)) != EOF) {
        chars++;
        
        if (ch == '\n') {
            lines++;
        }
        
        if (ch == ' ' || ch == '\t' || ch == '\n') {
            in_word = 0;
        } else if (!in_word) {
            in_word = 1;
            words++;
        }
    }
    
    fclose(fp);
    
    printf("文件统计信息:\n");
    printf("行数: %d\n", lines);
    printf("字数: %d\n", words);
    printf("字符数: %d\n", chars);
}

int main() {
    count_file_stats("example.txt");
    return 0;
}
```

### 2. 学生成绩管理系统

```c
#include <stdio.h>
#include <string.h>

#define MAX_STUDENTS 100
#define NAME_LENGTH 50

struct Student {
    int id;
    char name[NAME_LENGTH];
    float math;
    float english;
    float science;
    float average;
};

// 保存学生数据到文件
void save_students(struct Student students[], int count) {
    FILE *fp = fopen("students.txt", "w");
    if (fp == NULL) {
        printf("无法创建文件\n");
        return;
    }
    
    fprintf(fp, "%d\n", count);  // 先写入学生数量
    
    for (int i = 0; i < count; i++) {
        fprintf(fp, "%d %s %.2f %.2f %.2f %.2f\n",
                students[i].id, students[i].name,
                students[i].math, students[i].english,
                students[i].science, students[i].average);
    }
    
    fclose(fp);
    printf("数据保存成功\n");
}

// 从文件加载学生数据
int load_students(struct Student students[]) {
    FILE *fp = fopen("students.txt", "r");
    if (fp == NULL) {
        printf("文件不存在，将创建新文件\n");
        return 0;
    }
    
    int count;
    fscanf(fp, "%d", &count);
    
    for (int i = 0; i < count; i++) {
        fscanf(fp, "%d %s %f %f %f %f",
               &students[i].id, students[i].name,
               &students[i].math, &students[i].english,
               &students[i].science, &students[i].average);
    }
    
    fclose(fp);
    printf("加载了 %d 个学生的数据\n", count);
    return count;
}

// 计算平均分
void calculate_average(struct Student *student) {
    student->average = (student->math + student->english + student->science) / 3.0;
}

// 显示学生信息
void display_students(struct Student students[], int count) {
    printf("\n学生成绩表:\n");
    printf("ID\t姓名\t\t数学\t英语\t科学\t平均分\n");
    printf("--------------------------------------------------------\n");
    
    for (int i = 0; i < count; i++) {
        printf("%d\t%-10s\t%.1f\t%.1f\t%.1f\t%.1f\n",
               students[i].id, students[i].name,
               students[i].math, students[i].english,
               students[i].science, students[i].average);
    }
}

int main() {
    struct Student students[MAX_STUDENTS];
    int count = 0;
    int choice;
    
    // 加载现有数据
    count = load_students(students);
    
    while (1) {
        printf("\n学生成绩管理系统\n");
        printf("1. 添加学生\n");
        printf("2. 显示所有学生\n");
        printf("3. 保存数据\n");
        printf("4. 退出\n");
        printf("请选择: ");
        
        scanf("%d", &choice);
        
        switch (choice) {
            case 1:
                if (count < MAX_STUDENTS) {
                    printf("输入学生ID: ");
                    scanf("%d", &students[count].id);
                    printf("输入姓名: ");
                    scanf("%s", students[count].name);
                    printf("输入数学成绩: ");
                    scanf("%f", &students[count].math);
                    printf("输入英语成绩: ");
                    scanf("%f", &students[count].english);
                    printf("输入科学成绩: ");
                    scanf("%f", &students[count].science);
                    
                    calculate_average(&students[count]);
                    count++;
                    printf("学生添加成功\n");
                } else {
                    printf("学生数量已达上限\n");
                }
                break;
                
            case 2:
                display_students(students, count);
                break;
                
            case 3:
                save_students(students, count);
                break;
                
            case 4:
                save_students(students, count);
                printf("程序退出\n");
                return 0;
                
            default:
                printf("无效选择\n");
        }
    }
    
    return 0;
}
```

## 最佳实践

### 1. 错误处理

- 始终检查文件操作的返回值
- 使用适当的错误处理机制
- 提供有意义的错误信息

### 2. 资源管理

- 确保每个打开的文件都被关闭
- 使用完文件后立即关闭
- 考虑使用RAII模式（在C++中）

### 3. 性能优化

- 对于大文件，考虑使用缓冲区
- 选择合适的读写函数
- 避免频繁的文件定位操作

### 4. 安全考虑

- 验证文件路径的安全性
- 检查文件权限
- 防止缓冲区溢出

## 总结

C语言的文件操作功能强大且灵活，掌握这些操作对于开发实用的程序至关重要。通过本文的学习，你应该能够：

1. 理解文件操作的基本概念
2. 掌握文件的打开、读写和关闭操作
3. 使用不同的文件操作函数
4. 处理文件操作中的错误
5. 应用文件操作解决实际问题

记住，良好的编程习惯包括适当的错误处理和资源管理，这在文件操作中尤为重要。

## 参考资料

- C语言标准库文档
- 《C程序设计语言》- Brian Kernighan & Dennis Ritchie
- [C文件操作参考](https://en.cppreference.com/w/c/io)

---

*本文档持续更新中，欢迎提供反馈和建议。*