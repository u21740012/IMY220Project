public class App {
    public static void main(String[] args) {
        test();
        test1();
        test2();
        test3();
        test4();
        testMirrored();
        testStandard();
    }

    public static void test() {
        System.out.println("TEST \n");
        BinaryTree<Integer> t = new StandardBinaryTree<>();
        // BinaryTree<Integer> tree = t.convertTree();

        t.insert(1);
        t.insert(2);
        t.insert(3);
        t.insert(6);
        t.insert(8);
        t.insert(710);
        BinaryTree<Integer> tree = t.convertTree();
        System.out.println("Tree Height");
        System.out.println(t.height() + "\n");
        System.out.println("Tree Number of Leaves");
        System.out.println(t.numLeavesInTree() + "\n");
        System.out.println("Depth First Traversal");
        t.depthFirstTraversal();
        System.out.println("\nFind parent of [3]");
        t.findParent(3);
        System.out.println("\nFind [1]");
        t.find(1);
        System.out.println("\nContains [5]");
        t.contains(5);
        System.out.println("PERFECTLY BALANCED: " + t.perfectlyBalanced());
        System.out.println("MirroredBinaryTree: ");
        tree.depthFirstTraversal();

    }

    public static void test1() {
        System.out.println("TEST 1\n");
        BinaryTree<Integer> newTree = new MirroredBinaryTree<>();
        for (int i = 0; i <= 5; i++) {
            newTree.insert(i);
        }
        BinaryTree<Integer> tree = newTree.convertTree(); // converts to standard tree
        System.out.println(" Mirrored Binary Tree Depth First Traversal:");
        newTree.depthFirstTraversal();
        System.out.println("\nParent Search:");
        if (newTree.findParent(6) != null) {
            System.out.println("Found");
        } else {
            System.out.println("No Parent Found");
        }
        System.out.println("\nFind Function");
        if (newTree.find(10) != null) {
            System.out.println(newTree.toString());
            System.out.println("Found");
        } else {
            System.out.println("Not Found");
        }
        System.out.println("\nContains Function");
        if (newTree.contains(2) == true) {
            System.out.println("Data is in the Tree");
        } else {
            System.out.println("Data is not in the Tree");
        }

        System.out.println("Standard Binary Tree Depth First Traversal after converting the tree:");
        tree.depthFirstTraversal();
        System.out.println("Mirrored Binary Tree Depth First Traversal: ");
        newTree.depthFirstTraversal();
    }

    public static void test2() {
        System.out.println("TEST 2\n");
        BinaryTree<Integer> fakeTree = new StandardBinaryTree<>();
        fakeTree.insert(1);
        fakeTree.insert(90);
        fakeTree.insert(9);
        fakeTree.insert(-1);
        fakeTree.insert(-9);
        fakeTree.insert(0);
        System.out.println("TESTING TREES: \n");
        System.out.println("TESTING TRAVERSAL: \n");
        fakeTree.depthFirstTraversal();
        System.out.println("CONTAIN FUNCTION: \n");
        fakeTree.contains(1);
        System.out.println("FIND FUNCTION: \n");
        fakeTree.find(6);
        System.out.println("FIND PARENT FUNCTION: \n");
        fakeTree.findParent(9);

        BinaryTree<Integer> fakeMirroredTree = new MirroredBinaryTree<>();
        System.out.println("CONVERTING THE TREE: \n");
        fakeMirroredTree = fakeTree.convertTree();
        fakeMirroredTree.depthFirstTraversal();
        System.out.println("TESTING MIRRORED TREES: \n");
        System.out.println("TESTING TRAVERSAL: \n");
        fakeMirroredTree.depthFirstTraversal();
        System.out.println("CONTAIN FUNCTION: \n");
        fakeMirroredTree.contains(1);
        System.out.println("FIND FUNCTION: \n");
        fakeMirroredTree.find(6);
        System.out.println("FIND PARENT FUNCTION: \n");
        fakeMirroredTree.findParent(9);

        System.out.println("EMPTY TREES: \n");
        BinaryTree<Integer> fakeEmpty = new MirroredBinaryTree<>();
        BinaryTree<Integer> fakeEmptyNormal = new StandardBinaryTree<>();
        System.out.println("TESTING AN EMPTY CONVERT: \n");
        if (fakeEmptyNormal.convertTree() != null) {
            System.out.println("Tree is empty but new tree object has been created");
        }
        System.out.println("TESTING AN EMPTY CONTAINS: \n");
        if (fakeEmpty.contains(1) == false) {
            System.out.println("EMPTY");
        }
        System.out.println("TESTING AN EMPTY FIND \n");
        if (fakeEmpty.find(2) == null) {
            System.out.println("EMPTY");
        }
        System.out.println("TESTING AN EMPTY FIND PARENT \n");
        if (fakeEmpty.findParent(3) == null) {
            System.out.println("EMPTY");
        }
        System.out.println("TESTING AN EMPTY NUM LEAVES \n");
        System.out.println(fakeEmpty.numLeavesInTree());
        System.out.println("TESTING AN EMPTY HEIGHT \n");
        System.out.println(fakeEmpty.height());
        System.out.println("TESTING AN EMPTY PERFECTLY BALANCED \n");
        if (fakeEmpty.perfectlyBalanced() == false) {
            System.out.println("EMPTY");
        }

    }

    public static void test3() {
        System.out.println("TEST 3\n");
        BinaryTree<Integer> t = new StandardBinaryTree<>();

        t.insert(2);
        t.insert(1);
        t.insert(3);

        System.out.println("Tree Height");
        System.out.println(t.height() + "\n");
        System.out.println("Tree Number of Leaves");
        System.out.println(t.numLeavesInTree() + "\n");
        System.out.println("Depth First Traversal");
        t.depthFirstTraversal();
        System.out.println("\nFind parent of [3]");
        t.findParent(3);
        System.out.println("\nFind [1]");
        t.find(1);
        System.out.println("\nContains [5]");
        t.contains(5);

        BinaryTree<Integer> test = new StandardBinaryTree<>();
        System.out.println(
                "\nthe following list of numbers is the order in which the nodes are inserted to get the binary tree for if you want to visualize it: \n");
        for (int i = 10; i < 20; i++) {
            test.insert((i % 2 + 1) * i + i);
            System.out.print(((i % 2 + 1) * i + i) + ",");
        }

        for (int i = 9; i >= 1; i--) {
            test.insert((i % 2 + 1) * i + i);
            System.out.print(((i % 2 + 1) * i + i) + ",");
        }

        System.out.println("\n");
        System.out.println("Tree Height");
        System.out.println(test.height() + "\n");
        System.out.println("Tree Number of Leaves");
        System.out.println(test.numLeavesInTree() + "\n");
        System.out.println("Depth First Traversal");
        test.depthFirstTraversal();
        System.out.println("\nFind parent of [3]");
        test.findParent(3);
        System.out.println("\nFind [1]");
        test.find(1);
        System.out.println("\nContains [5]");
        test.contains(5);

        BinaryTree<Integer> test2 = test.convertTree();

        System.out.println("Tree Height");
        System.out.println(test2.height() + "\n");
        System.out.println("Tree Number of Leaves");
        System.out.println(test2.numLeavesInTree() + "\n");
        System.out.println("Depth First Traversal");
        test2.depthFirstTraversal();
        System.out.println("\nFind parent of [3]");
        test2.findParent(3);
        System.out.println("\nFind [1]");
        test2.find(1);
        System.out.println("\nContains [5]");
        test2.contains(5);
    }

    public static void test4() {
        BinaryTree<Integer> t = new StandardBinaryTree<>();

        t.insert(2);
        t.insert(1);
        t.insert(3);

        System.out.println("Tree Height");
        System.out.println(t.height() + "\n");
        System.out.println("Tree Number of Leaves");
        System.out.println(t.numLeavesInTree() + "\n");
        System.out.println("Depth First Traversal");
        t.depthFirstTraversal();
        System.out.println("\nFind parent of [3]");
        t.findParent(3);
        System.out.println("\nFind [1]");
        t.find(1);
        System.out.println("\nContains [5]");
        t.contains(5);
    }

    public static void testStandard() {
        BinaryTree<Integer> t = new StandardBinaryTree<>();
        int last_item = 0;
        System.out.println("Height of zero nodes in tree: " + t.height() + "\n");

        t.insert(10);
        t.insert(9);
        t.insert(20);
        t.insert(45);
        t.insert(58);
        t.insert(18);
        t.insert(22);
        t.insert(32);
        t.height();

        System.out.println("Tree Height: " + t.height() + "\n");
        System.out.println("Tree Number of Leaves: " + t.numLeavesInTree() + "\n");
        System.out.println("Contains: " + 20 + ": " + t.contains(20) + "\n");
        t.find(45);
        System.out.println("Find: " + 45 + "\n" + t.find(45) + "\n");
        System.out.println("Find: " + 18 + "\n" + t.findParent(18) + "\n");
        System.out.println("Prefectly balanced: " + t.perfectlyBalanced() + "\n");

        BinaryTree<Integer> u = t.convertTree();
        System.out.println("Mirrored tree: ");
        System.out.println("Tree Height: " + u.height() + "\n");
        System.out.println("Tree Number of Leaves: " + u.numLeavesInTree() + "\n");
        System.out.println("Contains: " + 32 + ": " + u.contains(32) + "\n");
        System.out.println("Find: " + 22 + "\n" + u.find(22) + "\n");
        System.out.println("Find: " + 18 + "\n" + u.findParent(18) + "\n");
        System.out.println("Prefectly balanced: " + u.perfectlyBalanced() + "\n");
    }

    public static void testMirrored() {
        BinaryTree<Integer> t = new MirroredBinaryTree<>();
        int last_item = 0;
        System.out.println("Height of zero nodes in tree: " + t.height() + "\n");

        t.insert(10);
        t.insert(9);
        t.insert(20);
        t.insert(45);
        t.insert(58);
        t.insert(18);
        t.insert(22);
        t.insert(32);
        t.height();

        System.out.println("Tree Height: " + t.height() + "\n");
        System.out.println("Tree Number of Leaves: " + t.numLeavesInTree() + "\n");
        System.out.println("Contains: " + 20 + ": " + t.contains(20) + "\n");
        t.find(45);
        System.out.println("Find: " + 45 + "\n" + t.find(45) + "\n");
        System.out.println("Find: " + 18 + "\n" + t.findParent(18) + "\n");
        System.out.println("Prefectly balanced: " + t.perfectlyBalanced() + "\n");

        BinaryTree<Integer> u = t.convertTree();
        System.out.println("Mirrored tree: ");
        System.out.println("Tree Height: " + u.height() + "\n");
        System.out.println("Tree Number of Leaves: " + u.numLeavesInTree() + "\n");
        System.out.println("Contains: " + 32 + ": " + u.contains(32) + "\n");
        System.out.println("Find: " + 22 + "\n" + u.find(22) + "\n");
        System.out.println("Find: " + 18 + "\n" + u.findParent(18) + "\n");
        System.out.println("Prefectly balanced: " + u.perfectlyBalanced() + "\n");
    }
}

/*
 * TEST 

Tree Height
5

Tree Number of Leaves
6

Depth First Traversal
L[null]<-[1]->R[2]
L[null]<-[2]->R[3]
L[null]<-[3]->R[6]
L[null]<-[6]->R[8]
L[null]<-[8]->R[710]
L[null]<-[710]->R[null]

Find parent of [3]
L[null]<-[1]->R[2]
L[null]<-[2]->R[3]

Find [1]
L[null]<-[1]->R[2]

Contains [5]
L[null]<-[1]->R[2]
L[null]<-[2]->R[3]
L[null]<-[3]->R[6]
L[null]<-[6]->R[8]
PERFECTLY BALANCED: false
MirroredBinaryTree:
L[2]<-[1]->R[null]
L[3]<-[2]->R[null]
L[6]<-[3]->R[null]
L[8]<-[6]->R[null]
L[710]<-[8]->R[null]
L[null]<-[710]->R[null]
TEST 1

 Mirrored Binary Tree Depth First Traversal:
L[1]<-[0]->R[null]
L[2]<-[1]->R[null]
L[3]<-[2]->R[null]
L[4]<-[3]->R[null]
L[5]<-[4]->R[null]
L[null]<-[5]->R[null]

Parent Search:
L[1]<-[0]->R[null]
L[2]<-[1]->R[null]
L[3]<-[2]->R[null]
L[4]<-[3]->R[null]
L[5]<-[4]->R[null]
L[null]<-[5]->R[null]
No Parent Found

Find Function
L[1]<-[0]->R[null]
L[2]<-[1]->R[null]
L[3]<-[2]->R[null]
L[4]<-[3]->R[null]
L[5]<-[4]->R[null]
L[null]<-[5]->R[null]
Not Found

Contains Function
L[1]<-[0]->R[null]
L[2]<-[1]->R[null]
L[3]<-[2]->R[null]
Data is in the Tree
Standard Binary Tree Depth First Traversal after converting the tree:
L[null]<-[0]->R[1]
L[null]<-[1]->R[2]
L[null]<-[2]->R[3]
L[null]<-[3]->R[4]
L[null]<-[4]->R[5]
L[null]<-[5]->R[null]
Mirrored Binary Tree Depth First Traversal:
L[1]<-[0]->R[null]
L[2]<-[1]->R[null]
L[3]<-[2]->R[null]
L[4]<-[3]->R[null]
L[5]<-[4]->R[null]
L[null]<-[5]->R[null]
TEST 2

TESTING TREES:

TESTING TRAVERSAL:

L[null]<-[-9]->R[null]
L[-9]<-[-1]->R[0]
L[null]<-[0]->R[null]
L[-1]<-[1]->R[90]
L[null]<-[9]->R[null]
L[9]<-[90]->R[null]
CONTAIN FUNCTION:

L[-1]<-[1]->R[90]
FIND FUNCTION:

L[-1]<-[1]->R[90]
L[9]<-[90]->R[null]
L[null]<-[9]->R[null]
FIND PARENT FUNCTION:

L[-1]<-[1]->R[90]
L[9]<-[90]->R[null]
CONVERTING THE TREE:

L[null]<-[-9]->R[null]
L[0]<-[-1]->R[-9]
L[null]<-[0]->R[null]
L[90]<-[1]->R[-1]
L[null]<-[9]->R[null]
L[null]<-[90]->R[9]
TESTING MIRRORED TREES:

TESTING TRAVERSAL:

L[null]<-[-9]->R[null]
L[0]<-[-1]->R[-9]
L[null]<-[0]->R[null]
L[90]<-[1]->R[-1]
L[null]<-[9]->R[null]
L[null]<-[90]->R[9]
CONTAIN FUNCTION:

L[90]<-[1]->R[-1]
FIND FUNCTION:

L[90]<-[1]->R[-1]
L[null]<-[90]->R[9]
L[null]<-[9]->R[null]
FIND PARENT FUNCTION:

L[90]<-[1]->R[-1]
L[null]<-[90]->R[9]
EMPTY TREES:

TESTING AN EMPTY CONVERT:

Tree is empty but new tree object has been created
TESTING AN EMPTY CONTAINS:

EMPTY
TESTING AN EMPTY FIND

EMPTY
TESTING AN EMPTY FIND PARENT

EMPTY
TESTING AN EMPTY NUM LEAVES

0
TESTING AN EMPTY HEIGHT

0
TESTING AN EMPTY PERFECTLY BALANCED

EMPTY
TEST 3

Tree Height
1

Tree Number of Leaves
3

Depth First Traversal
L[null]<-[1]->R[null]
L[1]<-[2]->R[3]
L[null]<-[3]->R[null]

Find parent of [3]
L[1]<-[2]->R[3]

Find [1]
L[1]<-[2]->R[3]
L[null]<-[1]->R[null]

Contains [5]
L[1]<-[2]->R[3]
L[null]<-[3]->R[null]

the following list of numbers is the order in which the nodes are inserted to get the binary tree for if you want to visualize it:

20,33,24,39,28,45,32,51,36,57,27,16,21,12,15,8,9,4,3,

Tree Height
5

Tree Number of Leaves
19

Depth First Traversal
L[null]<-[3]->R[null]
L[3]<-[4]->R[null]
L[4]<-[8]->R[9]
L[null]<-[9]->R[null]
L[8]<-[12]->R[15]
L[null]<-[15]->R[null]
L[12]<-[16]->R[null]
L[16]<-[20]->R[33]
L[null]<-[21]->R[null]
L[21]<-[24]->R[28]
L[null]<-[27]->R[null]
L[27]<-[28]->R[32]
L[null]<-[32]->R[null]
L[24]<-[33]->R[39]
L[null]<-[36]->R[null]
L[36]<-[39]->R[45]
L[null]<-[45]->R[51]
L[null]<-[51]->R[57]
L[null]<-[57]->R[null]

Find parent of [3]
L[16]<-[20]->R[33]
L[12]<-[16]->R[null]
L[8]<-[12]->R[15]
L[4]<-[8]->R[9]
L[3]<-[4]->R[null]

Find [1]
L[16]<-[20]->R[33]
L[12]<-[16]->R[null]
L[8]<-[12]->R[15]
L[4]<-[8]->R[9]
L[3]<-[4]->R[null]
L[null]<-[3]->R[null]

Contains [5]
L[16]<-[20]->R[33]
L[12]<-[16]->R[null]
L[8]<-[12]->R[15]
L[4]<-[8]->R[9]
L[3]<-[4]->R[null]
Tree Height
5

Tree Number of Leaves
19

Depth First Traversal
L[null]<-[3]->R[null]
L[null]<-[4]->R[3]
L[9]<-[8]->R[4]
L[null]<-[9]->R[null]
L[15]<-[12]->R[8]
L[null]<-[15]->R[null]
L[null]<-[16]->R[12]
L[33]<-[20]->R[16]
L[null]<-[21]->R[null]
L[28]<-[24]->R[21]
L[null]<-[27]->R[null]
L[32]<-[28]->R[27]
L[null]<-[32]->R[null]
L[39]<-[33]->R[24]
L[null]<-[36]->R[null]
L[45]<-[39]->R[36]
L[51]<-[45]->R[null]
L[57]<-[51]->R[null]
L[null]<-[57]->R[null]

Find parent of [3]
L[33]<-[20]->R[16]
L[null]<-[16]->R[12]
L[15]<-[12]->R[8]
L[9]<-[8]->R[4]
L[null]<-[4]->R[3]

Find [1]
L[33]<-[20]->R[16]
L[null]<-[16]->R[12]
L[15]<-[12]->R[8]
L[9]<-[8]->R[4]
L[null]<-[4]->R[3]
L[null]<-[3]->R[null]

Contains [5]
L[33]<-[20]->R[16]
L[null]<-[16]->R[12]
L[15]<-[12]->R[8]
L[9]<-[8]->R[4]
L[null]<-[4]->R[3]

TEST 4!!!!!!!!!
Tree Height
1

Tree Number of Leaves
3

Depth First Traversal
L[null]<-[1]->R[null]
L[1]<-[2]->R[3]
L[null]<-[3]->R[null]

Find parent of [3]
L[1]<-[2]->R[3]

Find [1]
L[1]<-[2]->R[3]
L[null]<-[1]->R[null]

Contains [5]
L[1]<-[2]->R[3]
L[null]<-[3]->R[null]
Height of zero nodes in tree: 0

Tree Height: 4

Tree Number of Leaves: 8

L[20]<-[10]->R[9]
L[45]<-[20]->R[18]
Contains: 20: true

L[20]<-[10]->R[9]
L[45]<-[20]->R[18]
L[58]<-[45]->R[22]
L[20]<-[10]->R[9]
L[45]<-[20]->R[18]
L[58]<-[45]->R[22]
Find: 45
L[58]<-[45]->R[22]

L[20]<-[10]->R[9]
L[45]<-[20]->R[18]
Find: 18
L[45]<-[20]->R[18]

Prefectly balanced: false

Mirrored tree:
Tree Height: 4

Tree Number of Leaves: 8

L[9]<-[10]->R[20]
L[18]<-[20]->R[45]
L[22]<-[45]->R[58]
L[null]<-[22]->R[32]
L[null]<-[32]->R[null]
Contains: 32: true

L[9]<-[10]->R[20]
L[18]<-[20]->R[45]
L[22]<-[45]->R[58]
L[null]<-[22]->R[32]
Find: 22
L[null]<-[22]->R[32]

L[9]<-[10]->R[20]
L[18]<-[20]->R[45]
Find: 18
L[18]<-[20]->R[45]

Prefectly balanced: false

Height of zero nodes in tree: 0

Tree Height: 4

Tree Number of Leaves: 8

L[9]<-[10]->R[20]
L[18]<-[20]->R[45]
Contains: 20: true

L[9]<-[10]->R[20]
L[18]<-[20]->R[45]
L[22]<-[45]->R[58]
L[9]<-[10]->R[20]
L[18]<-[20]->R[45]
L[22]<-[45]->R[58]
Find: 45
L[22]<-[45]->R[58]

L[9]<-[10]->R[20]
L[18]<-[20]->R[45]
Find: 18
L[18]<-[20]->R[45]

Prefectly balanced: false

Mirrored tree:
Tree Height: 4

Tree Number of Leaves: 8

L[20]<-[10]->R[9]
L[45]<-[20]->R[18]
L[58]<-[45]->R[22]
L[32]<-[22]->R[null]
L[null]<-[32]->R[null]
Contains: 32: true

L[20]<-[10]->R[9]
L[45]<-[20]->R[18]
L[58]<-[45]->R[22]
L[32]<-[22]->R[null]
Find: 22
L[32]<-[22]->R[null]

L[20]<-[10]->R[9]
L[45]<-[20]->R[18]
Find: 18
L[45]<-[20]->R[18]

Prefectly balanced: false
 */