---
title: PHP数组完全指南
date: 2025-12-16 10:00:00
tags: ['PHP', '数组', '数据结构']
categories: [后端开发]
---

# PHP数组完全指南

PHP中的数组是一种非常重要的数据结构，它可以存储多个值在一个变量中。本文将详细介绍PHP数组的各个方面，从基础概念到高级应用。

## 目录
1. [数组基础](#数组基础)
2. [数组类型](#数组类型)
3. [数组操作](#数组操作)
4. [常用数组函数](#常用数组函数)
5. [数组遍历](#数组遍历)
6. [数组排序](#数组排序)
7. [数组高级应用](#数组高级应用)
8. [性能优化](#性能优化)
9. [实战案例](#实战案例)

## 数组基础

### 什么是数组

数组是一个有序映射，它把值映射到键上。这个类型在很多方面都做了优化，因此可以把它当成真正的数组、列表（向量）、哈希表（是映射的一种实现）、字典、集合、栈、队列以及更多可能性。

### 创建数组

```php
// 方式1：使用array()结构
$array1 = array(1, 2, 3, 4, 5);
$array2 = array(
    "name" => "张三",
    "age" => 25,
    "email" => "zhangsan@example.com"
);

// 方式2：使用短数组语法（推荐）
$array3 = [1, 2, 3, 4, 5];
$array4 = [
    "name" => "李四",
    "age" => 30,
    "email" => "lisi@example.com"
];

// 方式3：动态添加
$array5 = [];
$array5[] = "第一个元素";
$array5[] = "第二个元素";
$array5["key"] = "自定义键的值";
```

## 数组类型

### 1. 索引数组

使用数字作为键的数组，默认从0开始。

```php
$fruits = ["苹果", "香蕉", "橙子", "葡萄"];
// 等价于
$fruits = [0 => "苹果", 1 => "香蕉", 2 => "橙子", 3 => "葡萄"];

// 访问元素
echo $fruits[0];  // 输出：苹果
echo $fruits[1];  // 输出：香蕉
```

### 2. 关联数组

使用字符串作为键的数组。

```php
$person = [
    "姓名" => "王五",
    "年龄" => 35,
    "职业" => "工程师",
    "城市" => "北京"
];

// 访问元素
echo $person["姓名"];  // 输出：王五
echo $person["年龄"];  // 输出：35
```

### 3. 多维数组

包含其他数组的数组。

```php
// 二维数组
$students = [
    [
        "姓名" => "张三",
        "年龄" => 20,
        "成绩" => [85, 92, 88]
    ],
    [
        "姓名" => "李四",
        "年龄" => 21,
        "成绩" => [90, 87, 95]
    ]
];

// 访问多维数组元素
echo $students[0]["姓名"];           // 输出：张三
echo $students[1]["成绩"][0];        // 输出：90
```

## 数组操作

### 添加元素

```php
$array = ["a", "b", "c"];

// 末尾添加
$array[] = "d";
array_push($array, "e");

// 开头添加
array_unshift($array, "0");

// 指定位置插入
array_splice($array, 2, 0, ["x", "y"]);
```

### 删除元素

```php
$array = ["a", "b", "c", "d", "e"];

// 删除末尾元素
$last = array_pop($array);  // 返回 "e"

// 删除开头元素
$first = array_shift($array);  // 返回 "a"

// 删除指定键
unset($array[2]);

// 删除连续范围
array_splice($array, 1, 2);
```

### 修改元素

```php
$array = ["a", "b", "c"];

// 直接赋值修改
$array[1] = "new value";

// 批量修改
$array = array_map(function($value) {
    return strtoupper($value);
}, $array);
```

## 常用数组函数

### 1. 数组信息函数

```php
$array = ["a", "b", "c", "d", "e"];

// 获取数组长度
$count = count($array);          // 5
$size = sizeof($array);          // 5（count()的别名）

// 检查元素是否存在
$exists = in_array("c", $array);     // true
$keyExists = array_key_exists(1, $array);  // true

// 获取所有键
$keys = array_keys($array);       // [0, 1, 2, 3, 4]

// 获取所有值
$values = array_values($array);   // ["a", "b", "c", "d", "e"]

// 检查是否为空
$isEmpty = empty($array);         // false
```

### 2. 数组合并与拆分

```php
$array1 = ["a", "b", "c"];
$array2 = ["d", "e", "f"];
$array3 = ["x" => 1, "y" => 2];

// 合并数组
$merged = array_merge($array1, $array2);
// 结果：["a", "b", "c", "d", "e", "f"]

// 递归合并
$recursive = array_merge_recursive($array1, $array3);

// 拆分数组
$chunks = array_chunk($merged, 2);
// 结果：[["a", "b"], ["c", "d"], ["e", "f"]]
```

### 3. 数组过滤

```php
$array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// 过滤偶数
$evens = array_filter($array, function($value) {
    return $value % 2 == 0;
});
// 结果：[2, 4, 6, 8, 10]

// 移除空值
$noEmpty = array_filter($array);

// 使用回调修改
$doubled = array_map(function($value) {
    return $value * 2;
}, $array);
```

### 4. 数组查找与替换

```php
$array = ["apple", "banana", "orange", "grape"];

// 查找键
$key = array_search("orange", $array);  // 2

// 提取列（用于多维数组）
$users = [
    ["name" => "张三", "age" => 25],
    ["name" => "李四", "age" => 30],
    ["name" => "王五", "age" => 35]
];
$names = array_column($users, "name");  // ["张三", "李四", "王五"]

// 替换值
$replaced = str_replace(["apple", "banana"], ["苹果", "香蕉"], $array);
```

### 5. 数组统计

```php
$numbers = [1, 2, 3, 4, 5, 1, 2, 3];

// 计算总和
$sum = array_sum($numbers);  // 21

// 计算平均值
$average = array_sum($numbers) / count($numbers);  // 2.625

// 找出最大值和最小值
$max = max($numbers);  // 5
$min = min($numbers);  // 1

// 值出现的次数
$counts = array_count_values($numbers);
// 结果：[1 => 2, 2 => 2, 3 => 2, 4 => 1, 5 => 1]
```

## 数组遍历

### 1. for循环（适用于索引数组）

```php
$fruits = ["苹果", "香蕉", "橙子"];

for ($i = 0; $i < count($fruits); $i++) {
    echo $fruits[$i] . "\n";
}
```

### 2. foreach循环（推荐）

```php
// 遍历值
foreach ($fruits as $fruit) {
    echo $fruit . "\n";
}

// 遍历键值对
foreach ($fruits as $index => $fruit) {
    echo "索引 {$index}: {$fruit}\n";
}

// 遍历关联数组
$person = ["name" => "张三", "age" => 25];
foreach ($person as $key => $value) {
    echo "{$key}: {$value}\n";
}
```

### 3. 使用each函数（PHP 7.2已废弃）

```php
// 不推荐使用，仅作了解
reset($array);
while (list($key, $value) = each($array)) {
    echo "$key => $value\n";
}
```

### 4. 数组迭代器

```php
$iterator = new ArrayIterator($array);
foreach ($iterator as $key => $value) {
    echo "$key => $value\n";
}
```

## 数组排序

### 1. 基础排序函数

```php
$numbers = [5, 2, 8, 1, 9];

// 升序排序（索引重新排序）
sort($numbers);  // [1, 2, 5, 8, 9]

// 降序排序
rsort($numbers);  // [9, 8, 5, 2, 1]

// 升序排序（保持索引关联）
asort($numbers);

// 降序排序（保持索引关联）
arsort($numbers);
```

### 2. 关键数组排序

```php
$person = ["name" => "张三", "age" => 25, "city" => "北京"];

// 按键升序排序
ksort($person);

// 按键降序排序
krsort($person);
```

### 3. 自定义排序

```php
// 用户定义的比较函数
$users = [
    ["name" => "张三", "age" => 25],
    ["name" => "李四", "age" => 20],
    ["name" => "王五", "age" => 30]
];

// 按年龄排序
usort($users, function($a, $b) {
    return $a["age"] - $b["age"];
});

// 保持键关联的自定义排序
uasort($users, function($a, $b) {
    return strcmp($a["name"], $b["name"]);
});
```

### 4. 多维数组排序

```php
$students = [
    ["name" => "张三", "score" => 85, "class" => "A"],
    ["name" => "李四", "score" => 92, "class" => "B"],
    ["name" => "王五", "score" => 78, "class" => "A"]
];

// 按分数排序
array_multisort(
    array_column($students, "score"),
    SORT_DESC,
    $students
);

// 多条件排序
array_multisort(
    array_column($students, "class"), SORT_ASC,
    array_column($students, "score"), SORT_DESC,
    $students
);
```

### 5. 随机排序

```php
$cards = ["A", "K", "Q", "J", "10", "9", "8", "7"];
shuffle($cards);  // 随机打乱数组

// 随机抽取指定数量
$random = array_rand($cards, 3);  // 随机返回3个键名
```

## 数组高级应用

### 1. 数组栈和队列操作

```php
// 栈操作（后进先出）
$stack = [];
array_push($stack, "第一个");
array_push($stack, "第二个");
array_push($stack, "第三个");
$top = array_pop($stack);  // "第三个"

// 队列操作（先进先出）
$queue = [];
array_push($queue, "第一个");
array_push($queue, "第二个");
$first = array_shift($queue);  // "第一个"
array_push($queue, "第三个");  // 从尾部添加
```

### 2. 数组差集与交集

```php
$array1 = [1, 2, 3, 4, 5];
$array2 = [3, 4, 5, 6, 7];

// 差集（在array1中但不在array2中）
$diff = array_diff($array1, $array2);  // [1, 2]

// 交集（同时在两个数组中）
$intersect = array_intersect($array1, $array2);  // [3, 4, 5]

// 关联数组的差集
$assoc1 = ["a" => 1, "b" => 2, "c" => 3];
$assoc2 = ["a" => 1, "c" => 3, "d" => 4];
$assocDiff = array_diff_assoc($assoc1, $assoc2);  // ["b" => 2]
```

### 3. 数组去重

```php
$array = [1, 2, 2, 3, 3, 3, 4, 5, 5];

// 简单去重
$unique = array_unique($array);  // [1, 2, 3, 4, 5]

// 关联数组去重（根据特定值）
$users = [
    ["id" => 1, "name" => "张三", "email" => "zhangsan@test.com"],
    ["id" => 2, "name" => "李四", "email" => "lisi@test.com"],
    ["id" => 3, "name" => "张三", "email" => "zhangsan@test.com"]
];

$uniqueUsers = [];
foreach ($users as $user) {
    $uniqueUsers[$user["email"]] = $user;
}
$uniqueUsers = array_values($uniqueUsers);
```

### 4. 数组分页

```php
function paginateArray(array $array, int $page = 1, int $perPage = 10): array
{
    $total = count($array);
    $totalPages = ceil($total / $perPage);
    $page = max(1, min($page, $totalPages));
    $offset = ($page - 1) * $perPage;

    return [
        'data' => array_slice($array, $offset, $perPage),
        'current_page' => $page,
        'per_page' => $perPage,
        'total' => $total,
        'total_pages' => $totalPages
    ];
}

$data = range(1, 100);
$pageData = paginateArray($data, 2, 15);
```

### 5. 数组转换为字符串

```php
$array = ["苹果", "香蕉", "橙子"];

// 使用分隔符连接
$string = implode(", ", $array);  // "苹果, 香蕉, 橙子"

// JSON序列化
$json = json_encode($array, JSON_UNESCAPED_UNICODE);  // '["苹果","香蕉","橙子"]'

// 序列化（PHP格式）
$serialized = serialize($array);

// 自定义格式转换
function arrayToTable(array $data): string
{
    if (empty($data)) return '';

    $html = '<table>';
    $html .= '<tr><th>键</th><th>值</th></tr>';

    foreach ($data as $key => $value) {
        if (is_array($value)) {
            $value = 'Array(' . count($value) . ')';
        }
        $html .= "<tr><td>{$key}</td><td>{$value}</td></tr>";
    }

    $html .= '</table>';
    return $html;
}
```

## 性能优化

### 1. 选择正确的数组类型

```php
// 大量数据时，使用数字索引比字符串索引快
// 索引数组：O(1) 访问时间
// 关联数组：O(log n) 访问时间

// 预分配数组大小（如果知道大概长度）
$array = array_fill(0, 10000, null);  // 比动态扩展快
```

### 2. 循环优化

```php
// 缓存数组长度
for ($i = 0, $len = count($array); $i < $len; $i++) {
    // 处理
}

// foreach通常比for/while快
foreach ($array as $value) {
    // 处理
}

// 避免在循环中调用函数
// 不推荐
for ($i = 0; $i < count($array); $i++) { }

// 推荐
$count = count($array);
for ($i = 0; $i < $count; $i++) { }
```

### 3. 内存管理

```php
// 处理大数组时及时释放内存
foreach ($largeArray as $key => $value) {
    // 处理数据
    unset($largeArray[$key]);  // 释放已处理的元素
}

// 使用引用减少内存复制
foreach ($array as &$value) {
    $value = strtoupper($value);
}
unset($value);  // 释放引用
```

### 4. 使用生成器处理大数组

```php
function readLargeFile($file) {
    $handle = fopen($file, 'r');
    while (!feof($handle)) {
        yield fgets($handle);
    }
    fclose($handle);
}

foreach (readLargeFile('large.txt') as $line) {
    // 处理每一行，不会占用过多内存
}
```

## 实战案例

### 案例1：购物车系统

```php
class ShoppingCart {
    private $items = [];

    // 添加商品
    public function addItem($productId, $name, $price, $quantity = 1) {
        if (isset($this->items[$productId])) {
            $this->items[$productId]['quantity'] += $quantity;
        } else {
            $this->items[$productId] = [
                'name' => $name,
                'price' => $price,
                'quantity' => $quantity
            ];
        }
    }

    // 移除商品
    public function removeItem($productId) {
        unset($this->items[$productId]);
    }

    // 更新数量
    public function updateQuantity($productId, $quantity) {
        if ($quantity <= 0) {
            $this->removeItem($productId);
        } elseif (isset($this->items[$productId])) {
            $this->items[$productId]['quantity'] = $quantity;
        }
    }

    // 获取总金额
    public function getTotal() {
        $total = 0;
        foreach ($this->items as $item) {
            $total += $item['price'] * $item['quantity'];
        }
        return $total;
    }

    // 获取所有商品
    public function getItems() {
        return $this->items;
    }

    // 清空购物车
    public function clear() {
        $this->items = [];
    }

    // 获取商品总数
    public function getItemCount() {
        $count = 0;
        foreach ($this->items as $item) {
            $count += $item['quantity'];
        }
        return $count;
    }
}

// 使用示例
$cart = new ShoppingCart();
$cart->addItem(1, "iPhone", 5999, 1);
$cart->addItem(2, "AirPods", 999, 2);
echo "总金额: ￥" . $cart->getTotal();  // 总金额: ￥7997
```

### 案例2：配置管理器

```php
class ConfigManager {
    private $config = [];
    private $defaults = [
        'database' => [
            'host' => 'localhost',
            'port' => 3306,
            'charset' => 'utf8'
        ],
        'cache' => [
            'driver' => 'file',
            'ttl' => 3600
        ]
    ];

    public function __construct(array $config = []) {
        $this->config = array_merge_recursive($this->defaults, $config);
    }

    // 获取配置值（支持点号分隔的嵌套键）
    public function get($key, $default = null) {
        $keys = explode('.', $key);
        $value = $this->config;

        foreach ($keys as $k) {
            if (!isset($value[$k])) {
                return $default;
            }
            $value = $value[$k];
        }

        return $value;
    }

    // 设置配置值
    public function set($key, $value) {
        $keys = explode('.', $key);
        $current = &$this->config;

        foreach ($keys as $k) {
            if (!isset($current[$k]) || !is_array($current[$k])) {
                $current[$k] = [];
            }
            $current = &$current[$k];
        }

        $current = $value;
    }

    // 检查配置是否存在
    public function has($key) {
        return $this->get($key) !== null;
    }

    // 获取所有配置
    public function all() {
        return $this->config;
    }

    // 从文件加载配置
    public function loadFromFile($file) {
        if (file_exists($file)) {
            $content = include $file;
            if (is_array($content)) {
                $this->config = array_merge_recursive($this->config, $content);
            }
        }
    }
}

// 使用示例
$config = new ConfigManager();
$config->set('database.host', '192.168.1.100');
$config->set('app.name', 'MyApp');
echo $config->get('database.host');  // 192.168.1.100
```

### 案例3：数据分析器

```php
class DataAnalyzer {
    private $data = [];

    public function __construct(array $data) {
        $this->data = $data;
    }

    // 计算平均值
    public function average($field) {
        $values = array_column($this->data, $field);
        return array_sum($values) / count($values);
    }

    // 找出最大值
    public function max($field) {
        $values = array_column($this->data, $field);
        return max($values);
    }

    // 找出最小值
    public function min($field) {
        $values = array_column($this->data, $field);
        return min($values);
    }

    // 分组统计
    public function groupBy($field) {
        $groups = [];
        foreach ($this->data as $item) {
            $key = $item[$field];
            if (!isset($groups[$key])) {
                $groups[$key] = [];
            }
            $groups[$key][] = $item;
        }
        return $groups;
    }

    // 获取分位数
    public function percentile($field, $percentile) {
        $values = array_column($this->data, $field);
        sort($values);
        $index = ($percentile / 100) * (count($values) - 1);
        $lower = floor($index);
        $upper = ceil($index);

        if ($lower == $upper) {
            return $values[$lower];
        }

        $weight = $index - $lower;
        return $values[$lower] * (1 - $weight) + $values[$upper] * $weight;
    }

    // 获取频率分布
    public function frequency($field, $bins = 10) {
        $values = array_column($this->data, $field);
        $min = min($values);
        $max = max($values);
        $step = ($max - $min) / $bins;

        $distribution = array_fill(0, $bins, 0);
        foreach ($values as $value) {
            $bin = min((int)(($value - $min) / $step), $bins - 1);
            $distribution[$bin]++;
        }

        return $distribution;
    }
}

// 使用示例
$sales = [
    ['product' => 'A', 'price' => 100, 'quantity' => 10],
    ['product' => 'B', 'price' => 200, 'quantity' => 5],
    ['product' => 'A', 'price' => 120, 'quantity' => 8],
    ['product' => 'C', 'price' => 150, 'quantity' => 12],
];

$analyzer = new DataAnalyzer($sales);
echo "平均价格: " . $analyzer->average('price');  // 平均价格: 142.5
$groups = $analyzer->groupBy('product');  // 按产品分组
```

## 总结

PHP数组是一个功能强大的数据结构，掌握好数组的使用对于PHP开发至关重要。本文涵盖了：

1. **基础概念**：理解数组的创建、类型和基本操作
2. **常用函数**：熟练使用array_*系列函数
3. **遍历技巧**：选择合适的遍历方式
4. **排序方法**：掌握各种排序函数的使用
5. **高级应用**：理解数组在实际项目中的应用
6. **性能优化**：编写高效的数组操作代码
7. **实战案例**：通过实例加深理解

通过不断练习和实践，您将能够更加灵活地运用PHP数组来解决各种编程问题。记住，选择合适的数据结构和算法是编写高质量代码的关键。