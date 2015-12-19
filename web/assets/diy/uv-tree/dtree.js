/*--------------------------------------------------|
 | dTree 2.05 | www.destroydrop.com/javascript/tree/ |
 |---------------------------------------------------|
 | Copyright (c) 2002-2003 Geir Landr				|
 |                                                   |
 | This script can be used freely as long as all     |
 | copyright messages are intact.                    |
 |                                                   |
 | Updated: 17.04.2003                               |
 |--------------------------------------------------*/
/**
 songyw modify 2013/3/12 10:57:32
 for
 1、取消通过cookie作为中间存储，记录选中、打开状态，修改为 为dTree 增加存储区完成以上功能
 具体实现：通过selectedNode数组记录生成dTree时，存储所有node数组aNodes[]的数组下标,
 因为本树生成时，点击某节点时调用s()函数传入的就是这个数组下标
 2、增加单个结点单击 一次选中，再单击一次取消选中的功能。
 3、增加多选功能，将 selectedNode 修改为数组，用于存储选中节点。
 4、外部程序调用add节点时，增加节点是否选中功能.

 实现：
 1、增加add入参isSelected
 2、赋给Node._is
 3、调用addNode增加节点时，修改选中节点selectedNode数组。同时递归打开父节点
 5、增加用户树结构其他数据存放区域

 modify list:
 getSelected                function    modify      支持多选,并将返回修改为json对象或json对象数组，
 eg:[{'id':'idvalue1','name','nvalue1'},{'id':'idvalue2','name','nvalue2'}]
 s                          function    modify      增加单个结点单击 一次选中，再单击一次取消选中的功能，并操作选中数组
 dTree.config.multiSelect   var         add         用于多选标志位
 clearSelected              function    add         清除选中节点
 removeSeletedNode          function    add         从dTree的中间存储空间删除指定选中的node节点对应于aNodes[]的下标，并返回修改后的数组长度
 addSelectedNode            function    add         给dTree的中间存储空间增加选中的node节点对应于aNodes[]的下标
 dTree.selectedNode         var         modify      所有涉及使用此变量的地方都需要修改，所以增加function isSelectedNode()
 isSelectedNode             function    add         用于替换判断selectedNode值的地方
 addNode                    function    modify      外部程序调用add节点时，增加节点是否选中功能
 Node.userData              var         add         用于存放用户树结构复杂的数据。同时在getSelect中返回给用户。
 */


var _TREE_DEBUG = false;


// Node object
/**
 默认值的书写规则（从左至右，依次省略）
 即 tree.add(id,pid,name,url);后面5个参数可以省略
 2：有间隔时的默认值（如存在第6个参数，但第5个参数想用默认值）
 即 tree.add(id,pid,name,url,"",target);必须这样写
 其他 tree.add(id,pid,name,url,"","","","",true);
 */
function Node(id, pid, name, url, title, target, icon, iconOpen, open, isSelected, tmpData) {

    this.id = id;					//node节点ID
    this.pid = pid;					//node节点父节点ID
    this.name = name;				//node节点显示名称
    this.url = url;					//node节点url，可以为javascript:function(){}
    this.title = title;				//node节点鼠标放上去时显示的提示内容
    this.target = target;			//节点链接所打开的目标frame（如框架目标mainFrame或是_blank,_self之类）
    this.icon = icon;				//节点关闭时的显示图片的路径
    this.iconOpen = iconOpen;		//节点打开时的显示图片的路径
    this._io = open || false; 		//是否展开标志
    this._is = !!isSelected;	    //是否选中
    this._ls = false;				//if a node has any children and if it is the last sibling
    this._hc = false;				//is or not father node
    this._ai = 0;					//节点顺序，在aNodes[]数组中的位置
    this._p;						//父节点node对象
    this.userData = tmpData || null;//用户树节点的复杂数据信息
}

// Tree object, songyw add multiSelect flag 2013/3/12 11:15:56
function dTree(objName, iconPrefix) {
    this.config = {
        target: null,
        folderLinks: true,
        useSelection: true,
        useLines: true,
        useIcons: true,
        useStatusText: false,
        closeSameLevel: false,
        inOrder: false,
        multiSelect: false,
        checkbox: false    // 检查是否有复选框
    };
    this.icon = {
        root: iconPrefix + '/folderopen.gif',
        folder: iconPrefix + '/folder.gif',
        folderOpen: iconPrefix + '/folderopen.gif',
        node: iconPrefix + '/page.gif',
        empty: iconPrefix + '/empty.gif',
        line: iconPrefix + '/line.gif',
        join: iconPrefix + '/join.gif',
        joinBottom: iconPrefix + '/joinbottom.gif',
        plus: iconPrefix + '/plus.gif',
        plusBottom: iconPrefix + '/plusbottom.gif',
        minus: iconPrefix + '/minus.gif',
        minusBottom: iconPrefix + '/minusbottom.gif',
        nlPlus: iconPrefix + '/nolines_plus.gif',
        nlMinus: iconPrefix + '/nolines_minus.gif'
    };
    this.obj = objName;
    this.aNodes = [];
    this.aIndent = [];
    this.root = new Node(-1);
    this.selectedNode = []; //songyw modify 原始为对象或null，修改为[]数组，支持多选用的中间存储区
    this.selectedFound = false;
    this.completed = false;
}


// Adds a new node to the node array songyw modify for 使用方便
dTree.prototype.addDetail = function (id, pid, name, url, title, isSelected, userData, open, target, icon, iconOpen) {
    this.aNodes[this.aNodes.length] = new Node(id, pid, name, url, title, target, icon, iconOpen, open, isSelected, userData);
};
// Adds a new node to the node array songyw add for 简化使用
dTree.prototype.add = function (id, pid, name, url, title, isSelected, userData, open) {
    this.aNodes[this.aNodes.length] = new Node(id, pid, name, url, title, "", "", "", open, isSelected, userData);
};

//songyw add for  初始化树，主要是先对默认选中节点的父节点执行打开操作。通过遍历 selectedNode 数组 2013/3/12 15:17:39
dTree.prototype.init = function () {
    //alert('init');
    for (var i = 0; i < this.selectedNode.length; i++) {
        this.openTo(this.aNodes[this.selectedNode[i]].pid == -1 ? this.aNodes[this.selectedNode[i]].id : this.aNodes[this.selectedNode[i]].pid);
    }
};

// Open/close all nodes
dTree.prototype.openAll = function () {
    this.oAll(true);
};
dTree.prototype.closeAll = function () {
    this.oAll(false);
};

// Outputs the tree to the page
dTree.prototype.toString = function () {
    var str = '<div class="dtree">';
    if (document.getElementById) {
        str += this.addNode(this.root);//是个递归操作
    } else str += 'Browser not supported.';
    str += '</div>';
    //if (!this.selectedFound) this.selectedNode = []; // songyw modify 无逻辑意义，注视掉。
    this.completed = true;
    return str;
};

// Creates the tree structure songyw modify for 外部程序调用add节点时，增加节点是否选中功能 2013/3/12 13:51:21
dTree.prototype.addNode = function (pNode) {
    var str = '';
    var n = 0;
    if (this.config.inOrder) n = pNode._ai;
    for (n; n < this.aNodes.length; n++) {
        if (this.aNodes[n].pid == pNode.id) {
            var cn = this.aNodes[n];
            cn._p = pNode;
            cn._ai = n;
            this.setCS(cn);
            if (!cn.target && this.config.target) cn.target = this.config.target;
            if (!this.config.folderLinks && cn._hc) cn.url = null;
            //songyw modify for selectedNode 支持多选问题
            //if (this.config.useSelection && cn.id == this.selectedNode && !this.selectedFound) {
            //
            //	cn._is = true;
            //	this.selectedNode = n;
            //	this.selectedFound = true;
            //}
            //
            if (cn._is) {
                this.addSelectedNode(n);
            }

            str += this.node(cn, n);
            if (cn._ls) break;
        }
    }
    return str;
};

// Creates the node icon, url and text
dTree.prototype.node = function (node, nodeId) {
    var str = '<div class="dTreeNode">' + this.indent(node, nodeId);
    if (this.config.useIcons) {
        if (!node.icon) node.icon = (this.root.id == node.pid) ? this.icon.root : ((node._hc) ? this.icon.folder : this.icon.node);
        if (!node.iconOpen) node.iconOpen = (node._hc) ? this.icon.folderOpen : this.icon.node;
        if (this.root.id == node.pid) {
            node.icon = this.icon.root;
            node.iconOpen = this.icon.root;
        }
        str += '<img id="i' + this.obj + nodeId + '" src="' + ((node._io) ? node.iconOpen : node.icon) + '" alt="" />';
    }
    //添加上复选框
    if (this.config.checkbox == true) {
        //	alert(nodeId+","+json2string(node._p));
        //	alert(node._p._ai);
        str += '<input type="checkbox" name="checkboxValues"  style="cursor:pointer;" value="' + node.id + '" id="c' + this.obj + node.id
            + '" onClick="javascript:' + this.obj + '.cc(&quot;' + node._ai
            + '&quot;,&quot;' + node._p._ai + '&quot;);" ' + (node._is ? "checked" : '') + '/>';
    }
    if (node.url) {
        str += '<a id="s' + this.obj + nodeId + '" class="' + ((this.config.useSelection) ? ((node._is ? 'nodeSel' : 'node')) : 'node') + '" href="' + node.url + '"';
        if (node.title) str += ' title="' + node.title + '"';
        if (node.target) str += ' target="' + node.target + '"';
        if (this.config.useStatusText) str += ' onmouseover="window.status=\'' + node.name + '\';return true;" onmouseout="window.status=\'\';return true;" ';
        if (this.config.useSelection && ((node._hc && this.config.folderLinks) || !node._hc))
            str += ' onclick="javascript: ' + this.obj + '.s(' + nodeId + ');"';
        str += '>';
    }
    else if ((!this.config.folderLinks || !node.url) && node._hc && node.pid != this.root.id)
        str += '<a href="javascript: ' + this.obj + '.o(' + nodeId + ');" class="node">';
    str += node.name;
    if (node.url || ((!this.config.folderLinks || !node.url) && node._hc)) str += '</a>';
    str += '</div>';
    if (node._hc) {
        str += '<div id="d' + this.obj + nodeId + '" class="clip" style="display:' + ((this.root.id == node.pid || node._io) ? 'block' : 'none') + ';">';
        str += this.addNode(node);
        str += '</div>';
    }
    this.aIndent.pop();
    return str;
};

// Adds the empty and line icons
dTree.prototype.indent = function (node, nodeId) {
    var str = '';
    if (this.root.id != node.pid) {
        for (var n = 0; n < this.aIndent.length; n++)
            str += '<img src="' + ( (this.aIndent[n] == 1 && this.config.useLines) ? this.icon.line : this.icon.empty ) + '" alt="" />';
        (node._ls) ? this.aIndent.push(0) : this.aIndent.push(1);
        if (node._hc) {
            str += '<a href="javascript: ' + this.obj + '.o(' + nodeId + ');"><img id="j' + this.obj + nodeId + '" src="';
            if (!this.config.useLines) str += (node._io) ? this.icon.nlMinus : this.icon.nlPlus;
            else str += ( (node._io) ? ((node._ls && this.config.useLines) ? this.icon.minusBottom : this.icon.minus) : ((node._ls && this.config.useLines) ? this.icon.plusBottom : this.icon.plus ) );
            str += '" alt="" /></a>';
        } else str += '<img src="' + ( (this.config.useLines) ? ((node._ls) ? this.icon.joinBottom : this.icon.join ) : this.icon.empty) + '" alt="" />';
    }
    return str;
};

// Checks if a node has any children and if it is the last sibling
dTree.prototype.setCS = function (node) {
    var lastId;
    for (var n = 0; n < this.aNodes.length; n++) {
        if (this.aNodes[n].pid == node.id) node._hc = true;
        if (this.aNodes[n].pid == node.pid) lastId = this.aNodes[n].id;
    }
    if (lastId == node.id) node._ls = true;
};

// Returns the selected node
//songyw modify 2013/3/12 12:20:54 for 支持多选,并将返回修改为json对象或json对象数组
dTree.prototype.getSelected = function () {
    //return (sn) ? sn : null;
    if (!this.selectedFound) return null;
    if (this.config.multiSelect) {
        var retJson = [];
        for (var i = 0; i < this.selectedNode.length; i++) {
            var tmpNode = this.aNodes[this.selectedNode[i]];
            if (tmpNode.userData) {
                retJson[i] = tmpNode.userData;
            } else {
                retJson[i] = {'id': tmpNode.id, 'name': tmpNode.name, 'userData': tmpNode.userData};
            }
        }
        return retJson;
    } else {
        var tmpNode = this.aNodes[this.selectedNode[0]];
        if (tmpNode.userData) {
            return tmpNode.userData;
        } else {
            return {'id': tmpNode.id, 'name': tmpNode.name};
        }
    }

};
//获取选中节点的路径
dTree.prototype.getSelectedNodePath = function () {
    var path;
    if (!this.selectedFound) return null;
    if (this.config.multiSelect) {

    } else {
        var tmpNode = this.aNodes[this.selectedNode[0]];
        //path="["+tmpNode.id+"]["+tmpNode.pid+"]"+tmpNode.name;
        path = tmpNode.name;
        while (tmpNode.pid != -1) {
            var parentNode = tmpNode._p;
            //path="["+parentNode.id+"]["+parentNode.pid+"]"+parentNode.name+" > "+path;
            path = parentNode.name + path;
            tmpNode = parentNode;
        }
    }
    return path;
};

//songyw add for 从dTree的中间存储空间删除指定选中的node节点对应于aNodes[]的下标，并返回修改后的数组长度 2013/3/12 11:53:09,
dTree.prototype.removeSeletedNode = function (value) {
    this.aNodes[value]._is = false;
    for (var i = 0; i < this.selectedNode.length; i++) {
        if (this.selectedNode[i] == value) {
            this.selectedNode.splice(i, 1);
            break;
        }
    }
    if (this.selectedNode.length == 0) this.selectedFound = false;
    return this.selectedNode.length;
};

//songyw add for 给dTree的中间存储空间增加选中的node节点对应于aNodes[]的下标 2013/3/12 12:06:26
dTree.prototype.addSelectedNode = function (value) {
    //先判断是否已经存在于selectedNode数组
    for (var i = 0; i < this.selectedNode.length; i++) {
        if (this.selectedNode[i] == value) return this.selectedNode.length;
    }
    this.aNodes[value]._is = true;
    this.selectedNode[this.selectedNode.length] = value;
    this.selectedFound = true;
    return this.selectedNode.length;
};

dTree.prototype.isSelectedNode = function (id) {
    for (var i = 0; i < this.selectedNode.length; i++) {
        if (this.selectedNode[i] == id) return true;
    }
    return false;
}

// Highlights the selected node songyw modify for 支持多选，和反复取消、选中一个节点
dTree.prototype.s = function (id) {
    if (!this.config.useSelection) return;
    var cn = this.aNodes[id];
    if (cn._hc && !this.config.folderLinks) return;

    //songyw modify to support multi select 2013/3/12 11:48:47
    //if (this.selectedNode != id) {
    //    if (this.selectedNode || this.selectedNode == 0) {
    //        var eOld = document.getElementById("s" + this.obj + this.selectedNode);
    //        eOld.className = "node";
    //    }
    //    var eNew = document.getElementById("s" + this.obj + id);
    //    eNew.className = "nodeSel";
    //    this.selectedNode = id;
    //
    //}
    if (cn._is) {

        var eOld = document.getElementById("s" + this.obj + id);
        eOld.className = "node";
        this.removeSeletedNode(id);
        cn._is = false;

    }
    //songyw add for 单击节点高亮显示，表示选中，再次单击表示取消高亮选中 2013/3/12 10:56:46 begin
    else {
        //是否多选判断
        if (!this.config.multiSelect && this.selectedFound) {
            for (var i = 0; i < this.selectedNode.length;) {//因为removeSeletedNode会改变数组长度，所以不用i++，其实是一直从左边删除i=0的记录
                var eOld = document.getElementById("s" + this.obj + this.selectedNode[i]);

                eOld.className = "node";
                this.aNodes[this.selectedNode[i]]._is = false;
                this.removeSeletedNode(this.selectedNode[i]);
            }

        }
        var eNew = document.getElementById("s" + this.obj + id);
        eNew.className = "nodeSel";
        cn._is = true;
        this.addSelectedNode(id);
    }
    //songyw add for 单击节点高亮显示，表示选中，再次单击表示取消高亮选中 2013/3/12 10:56:46 end

};

//songyw add for 清除选中节点
dTree.prototype.clearSelected = function () {
    for (var i = 0; i < this.selectedNode.length;) {
        //获得页面节点对象
        var eOld = document.getElementById("s" + this.obj + this.selectedNode[i]);
        //清除高亮显示 高亮显示className='nodeSel'
        eOld.className = "node";
        //选中节点中间数组删除当前循环到的数组元素。其实永远是第一个即下标为0的数组元素。从左边0开始一直删除。
        this.selectedNode.splice(i, 1);
    }
}

// Toggle Open or close
dTree.prototype.o = function (id) {
    var cn = this.aNodes[id];
    this.nodeStatus(!cn._io, id, cn._ls);
    cn._io = !cn._io;
    if (this.config.closeSameLevel) this.closeLevel(cn);

};

// Open or close all nodes
dTree.prototype.oAll = function (status) {
    for (var n = 0; n < this.aNodes.length; n++) {
        if (this.aNodes[n]._hc && this.aNodes[n].pid != this.root.id) {
            this.nodeStatus(status, n, this.aNodes[n]._ls)
            this.aNodes[n]._io = status;
        }
    }
};

// Opens the tree to a specific node
dTree.prototype.openTo = function (nId, bSelect, bFirst) {
    if (_TREE_DEBUG)alert(nId);
    if (!bFirst) {
        for (var n = 0; n < this.aNodes.length; n++) {
            if (this.aNodes[n].id == nId) {
                nId = n;
                break;
            }
        }
    }

    var cn = this.aNodes[nId];
    if (cn.pid == this.root.id || !cn._p) return;
    cn._io = true;
    cn._is = bSelect;
    if (this.completed && cn._hc) this.nodeStatus(true, cn._ai, cn._ls);
    if (this.completed && bSelect) this.s(cn._ai);
    else if (bSelect) this._sn = cn._ai;
    this.openTo(cn._p._ai, false, true);
};

// Closes all nodes on the same level as certain node
dTree.prototype.closeLevel = function (node) {
    for (var n = 0; n < this.aNodes.length; n++) {
        if (this.aNodes[n].pid == node.pid && this.aNodes[n].id != node.id && this.aNodes[n]._hc) {
            this.nodeStatus(false, n, this.aNodes[n]._ls);
            this.aNodes[n]._io = false;
            this.closeAllChildren(this.aNodes[n]);
        }
    }
}

// Closes all children of a node
dTree.prototype.closeAllChildren = function (node) {
    for (var n = 0; n < this.aNodes.length; n++) {
        if (this.aNodes[n].pid == node.id && this.aNodes[n]._hc) {
            if (this.aNodes[n]._io) this.nodeStatus(false, n, this.aNodes[n]._ls);
            this.aNodes[n]._io = false;
            this.closeAllChildren(this.aNodes[n]);
        }
    }
}

// Change the status of a node(open or closed)
dTree.prototype.nodeStatus = function (status, id, bottom) {
    eDiv = document.getElementById('d' + this.obj + id);
    eJoin = document.getElementById('j' + this.obj + id);
    if (this.config.useIcons) {
        eIcon = document.getElementById('i' + this.obj + id);
        eIcon.src = (status) ? this.aNodes[id].iconOpen : this.aNodes[id].icon;
    }
    eJoin.src = (this.config.useLines) ?
        ((status) ? ((bottom) ? this.icon.minusBottom : this.icon.minus) : ((bottom) ? this.icon.plusBottom : this.icon.plus)) :
        ((status) ? this.icon.nlMinus : this.icon.nlPlus);
    eDiv.style.display = (status) ? 'block' : 'none';
};
//checkbox 多选   modify 5.14 wangwei
dTree.prototype.cc_parent = function (parent_node_ai, select_flag) {
    var node = this.aNodes[parent_node_ai];
    if (!select_flag) {
        var hasOtherChildrenSelected = false;
        for (var i = 0; i < this.selectedNode.length; i++) {
            if (this.aNodes[this.selectedNode[i]].pid == node.id) {
                hasOtherChildrenSelected = true;
                break;
            }
        }
        if (!hasOtherChildrenSelected) {
            this.removeSeletedNode(parent_node_ai);
            document.getElementById("c" + this.obj + node.id).checked = select_flag;
            if (node.pid != -1) this.cc_parent(node._p._ai, select_flag);
        }
    } else {
        this.addSelectedNode(parent_node_ai);
        document.getElementById("c" + this.obj + node.id).checked = select_flag;
        if (node.pid != -1) this.cc_parent(node._p._ai, select_flag);
    }
};

dTree.prototype.cc_children = function (node_ai, select_flag) {
    var node = this.aNodes[node_ai];
    console.log(node);
    document.getElementById("c" + this.obj + node.id).checked = select_flag;
    if (!select_flag) {
        this.removeSeletedNode(node_ai);
    } else {
        this.addSelectedNode(node_ai);
    }
    if (node._hc) {
        for (var i = parseInt(node_ai) + 1; i < this.aNodes.length; i++) {
            if (this.aNodes[i].pid == node.id) {
                this.cc_children(i, select_flag);
            }
        }
    }

};

dTree.prototype.cc = function (node_ai, parent_node_ai) {
    //首先获取这个多选框的id
    var node = this.aNodes[node_ai];
    var cs = document.getElementById("c" + this.obj + node.id).checked;
    console.log('children');
    this.cc_children(node_ai, cs);
    console.log('parent');
    this.cc_parent(parent_node_ai, cs);
//    var n;
//    var len = this.aNodes.length;
//
//    for (n = 0; n < len; n++) { //如果循环每一个节点
//        if (this.aNodes[n].pid == nodeId) { //如果选中的是非叶子节点,则要将所有的子节点选择和父节点一样
//            document.getElementById("c" + this.obj + this.aNodes[n].id).checked = cs;
//            this.cc(this.aNodes[n].id, nodeId);
//        }
//    }
//
//    if (cs == true) {  //当前是选中状态
//        var pid = nodePid;
//        var bSearch;
////        node._is=true;//设置选中
//        //    this.addSelectedNode(node._ai);
//        //    alert("!!!!!!!!!!!"+this.aNodes[nodeId]);
//
//        //   this.addSelectedNode(id);
//        do {
//            bSearch = false;
//            for (n = 0; n < len; n++) {  //循环每一个节点
//                if (this.aNodes[n].id == pid) {  //如果循环的节点的id等于PID
//                    document.getElementById("c" + this.obj + pid).checked = true; //那么这个循环的节点应该被选中
//                    pid = this.aNodes[n].pid;
////                    this.aNodes[pid]._is=true;//设置父节点选中
//                    //           this.aNodes[this.aNodes[n]._p._ai]._is=true;
//                    //       alert("@@@@@@@@@@@"+this.aNodes[n]._p._ai)
//                    this.addSelectedNode(this.aNodes[n]._p._ai);
//                    bSearch = true;
//                    break;
//                }
//            }
//        } while (bSearch == true);
//    }
//
//    if (cs == false) {      //如果被取消选择
//        var pid = nodePid;
////        node._is=false;
//        do {
//            for (j = 0; j < len; j++) {         //循环每一个多选框  如果这个节点的子节点有其他是选中的,则不取消
//                if (this.aNodes[j].pid == pid && document.getElementById("c" + this.obj + this.aNodes[j].id).checked == true) {
//                    return;
//                }
//            }
//            if (j == len) {   //循环结束
//                for (k = 0; k < len; k++) {
//                    if (this.aNodes[k].id == pid) {   //如果找到父节点
//                        document.getElementById("c" + this.obj + this.aNodes[k].id).checked = false;
//                        pid = this.aNodes[k].pid;
//                        break;
//                    }
//                }
//            }
//        } while (pid != -1);
//    }
};
// If Push and pop is not implemented by the browser
if (!Array.prototype.push) {
    Array.prototype.push = function array_push() {
        for (var i = 0; i < arguments.length; i++)
            this[this.length] = arguments[i];
        return this.length;
    }
}
if (!Array.prototype.pop) {
    Array.prototype.pop = function array_pop() {
        lastElement = this[this.length - 1];
        this.length = Math.max(this.length - 1, 0);
        return lastElement;
    }
}
