window.onload = function(){
    var data = {
        "0": {
            "id": 0,
            "pid": -1,
            "title": "微云",
            "type": "file"
        },
        "1": {
            "id": 1,
            "pid": 0,
            "title": "我的文档",
            "type": "file"
        },
        "2": {
            "id": 2,
            "pid": 0,
            "title": "我的音乐"
        },
        "3": {
            "id": 3,
            "pid": 2,
            "title": "周杰伦"
        },
        "4": {
            "id": 4,
            "pid": 3,
            "title": "发如雪"
        },
        "600": {
            "id": 600,
            "pid": 3,
            "title": "夜曲"
        },
        "2999": {
            "id": 2999,
            "pid": 1,
            "title": "js程序设计"
        },
        "4000": {
            "id": 4000,
            "pid": 3,
            "title": "稻香"
        },
        "23333": {
            "id": 23333,
            "pid": 2,
            "title": "王杰"
        },
        "29000": {
            "id": 29000,
            "pid": 1,
            "title": "js权威指南"
        },
        "244444": {
            "id": 244444,
            "pid": 2,
            "title": "张国荣"
        }
    }
    var cover = document.getElementById('cover');
    //树形菜单的父级
    var foldersMenu = document.getElementById('folders-menu');

    //树形菜单每一行的div
    var divs = foldersMenu.getElementsByTagName('div')

    //文件夹的层级显示导航
    var foldersHierarchy = document.getElementById('folders-hierarchy');
    //文件夹内容显示区域 
    var foldersContent = document.getElementById('folders-content');
    //功能导航子级的第一个div【下载、分享、移动到……的父级】
    var navTool = document.querySelector('.nav-left');

    //删除提示框
    var deleteEnsureBox = document.getElementById('deleteEnsureBox');
    //删除提示框的确认按钮
    var ensureToDelete = deleteEnsureBox.querySelector('.ensure');
    //删除提示框的取消按钮
    var cancelToDelete = deleteEnsureBox.querySelector('.cancel');
    //正在删除提示框
    var deleting = document.getElementById('deleting');

    //大图标文件的选中按钮
    var checkboxs = foldersContent.getElementsByTagName('span');
    //foldersContent里面所有的文件夹
    var folderItems = foldersContent.getElementsByTagName('li');

    //  页面头部区域  删除成功、新建成功、新建失败 的提示条
    var operationSucessfull = document.querySelector('.sucessfull');
    //  页面头部区域 “请选择文件” 的提示条
    var pleaseSeletFolder = document.querySelector('.pleaseSeletFolder');
    //  页面头部区域 “连接服务器超时，请稍后再试” 的提示条
    var tryAgainLater = document.querySelector('.tryAgainLater');

    //文件移动到 选择框
    var moveToNewPosition = document.getElementById('move-to-New-position');
    //当前被移动文件夹的所在的文件夹
    var currentParentFolder = moveToNewPosition.querySelector('.currentParentFolder');
    //文件移动到的目录缩小版
    var currentSmallMenu = moveToNewPosition.querySelector('.currentSmallMenu');
    //移动文件夹确认按钮
    var ensureToMove = moveToNewPosition.querySelector('.ensureToMove');
    //移动文件夹取消按钮
    var cancelToMove = moveToNewPosition.querySelector('.cancelToMove');
    //关闭移动文件夹选择框
    var MoveBoxClose = moveToNewPosition.querySelector('.MoveBoxClose');
    //移动到的文件夹不符合要求的提醒
    var repeatAlert = moveToNewPosition.querySelector('.repeatAlert');

    //定义一个变量存被点击选中的文件的个数
    var folderCheckedNum = 0;

    //树形菜单第一层级的div高度是45px，层级越低数值越小 递减3px
    var initalH = 45;
    //树形菜单第一层级的div的padding-left是20px,层级越低数值越大 递增28
    var initalPl = 20;

    //定义一个变量，存传入函数的id值，就是第一层级的pid
    var initalId = -1;

    //定义一个变量，存层级，控制不同层级的高度和padding-left的变化
    var level = -1;
//----------------------封装操作数据的方法----------------------------
    //1.通过指定的id,找到这个id所有的子级,返回一个数组
    function getChildsById(id){
        var arr = [];
        for(var attr in data ){
            if(data[attr].pid==id){
                arr.push(data[attr])
            }
        }
        return arr;
    }

    //2.传入一个id找到指定id 对应的数据以及它的祖先数组
    function getParentsById(id){
        var arr = [];
        //在data中用传入的id找到对应的那个对象
        var currentData = data[id]
        
        if(currentData){//如果能找到
            //就把找到的对象放到数组中
            arr.push(currentData);
            /*传入找到的这个对象的pid逐层往上找组向数组，
            把每次找到的数组都跟前一次找到的拼成一个新的数组*/
            arr = arr.concat(getParentsById(currentData.pid))
        }
        return arr
    }

    //3.传入一个id,，找到这个id对应的子孙数据
    function findDescendantId(deletedFolderId){
        var arr1 =[];
        var arr2 = [];
        arr1 = arr1.concat(getChildsById(deletedFolderId))
        for(var j = 0 ; j < arr1.length; j++){
            arr2.push(arr1[j].id)
        }
        for(var j = 0 ; j < arr2.length; j++){
            arr2 = arr2.concat(findDescendantId(arr2[j]))
        }
        return arr2;
    }

    /*4.传入一个放渲染文件夹的数据对象data，
    返回一个跟对象的id都不一样的         随机数           */
    function getNewFolderId(data){
        var arr = [];
        //生成一个1到999之间的随机整数
        var Num = Math.ceil(Math.random()*1000+1)
        //拿到渲染当前文件夹的数据的id
        for(var attr in data){
            arr.push(data[attr].id)
        }
        //如果生成的随机数和渲染其他文件夹的数据id不一样，就返回上个随机数
        for( var i = 0 ; i < arr.length; i++){
            if(arr[i]==Num){//如果相同，就在内部调用，知道找到不一样的数字为止
                getNewFolderId(data)
            }
        }
        return Num;
    }
    
    //5.传入一个文件名字和新建文件夹所在的文件id，在当前的数据里面去找，知道是否跟title重复了
    function titleIsRepeat(id,name){
        var n = 0;
        name = name.trim()
        var arr = getChildsById(id)//通过指定的id,找到这个id所有的子级,返回一个数据
        for(var i = 0; i < arr.length; i++){
            if(arr[i].title===name){
                n++;
            }
        }
        if(n>0){
            return false;
        }else{
            return true;
        }
    }

    //6.传入一个元素，然这个元素先显示再消失
    function FirstShowNextDispear(ele){
        ele.style.display = 'block'
        animate(ele,{top:0},1000,'linear',function(){
            ele.style.display = 'none';
            
            animate(ele,{top:-60},1,'linear')
        })
    }
//-------------------------生成树形目录----------------------------------------


    //生成树形目录
    foldersMenu.innerHTML = createHtml(data,initalId,level,initalH,initalPl);

/*页面加载时候的初始状态：
加载完之后文件层级导航默认显示第一目录微云文件夹的内容
    树形菜单第一目录微云高亮
    文件夹的层级显示导航显示微云并且高亮
    文件夹内容显示区显示二级文件夹大图标
*/
    //定义一个变量，存渲染第一层文件的数据
    var navArr = []
    //把第一层文件的数据放到数组中
    navArr.push(data['0'])
    //调用渲染导航的函数   文件夹的层级显示导航显示微云并且高亮
    createFolderNavHtml(navArr)
    //对应的文件主体内容去要显示文件大图标
    renderBigfolderIcon(navArr[0]['id']);
    //形菜单第一目录微云高亮
    divs[0].className = 'active';
    //记录第一次高亮的是一级标题微云
    foldersMenu.activeChild = divs[0];

    
    /*4.传入id,去渲染找pid跟这个id相同的数据 为树形目录 
    level的初始值是-1，因为要从第一层渲染++时候是0
    initalH 是第一层文件名所在div的高
    initalPl 是第一层所在div的padding-left
    */
    function createHtml(data,id,level,initalH,initalPl){
        //找到指定id下的所有子级
        var childs = getChildsById(id);
        level++;
        var html = '';
        
        if(childs.length > 0){
            html +=  `<ul>`;
            for(var attr in childs){
                var triangleIco = '';
                var childHtml = createHtml(data,childs[attr]['id'],level,initalH,initalPl);
                if(childHtml==''){
                    childHtml ='';
                }else{
                    triangleIco = 'icon-rightward';
                }
               html+=`
               <li style="">
                    <div class="" data-id="${childs[attr]['id']}" style="height:${initalH-level*3}px;padding-left:${initalPl+28*level}px">
                        <em class=" ${triangleIco}"></em>
                        <mark class="fold-folder-icon"></mark>
                        <span>${childs[attr]['title']}</span>
                    </div>
                    ${childHtml}
                </li>`
            }
            html+=`</ul>`;
        }
        return html;
    }


    /*5.拿到被点击元素的data-id值 targetId 
        树型目录里面的文件名父级div的集合divs
        树型目录目录的模块容器foldersMenu
        传入函数，对应找到树形目录节点data-id相同的加背景高亮 */
    function getDataIdAddBg(foldersMenu,targetId,divs){
        //如果之前有div高亮，先清除之前有高亮的div的高亮,再给data-id相同的加上背景高亮的class
        if(foldersMenu.activeChild){
            foldersMenu.activeChild.classList.remove('active')
        }
        for(var i = 0; i < divs.length; i++ ){
            //找到左边的div的data-id和当前被点击的a的的data-id相同的节点，给其加背景色
            if(divs[i].dataset.id==targetId){
                divs[i].className = 'active';
                //给父级一个自定义属性存这次高亮的元素
                foldersMenu.activeChild = divs[i];
            }
        }
    }

//-------------------点击左边树形目录 渲染导航结构----------------------------------------------
  //树形菜单每一行的div点击事件委托给父级
    foldersMenu.addEventListener('click',function(ev){
        
        //触发事件的节点
        var target = ev.target;
        
        //把触发事件的节点加到每行的div上
        //如果点击道德是树形菜单的父级 或者是ul就无效
        if(target.getAttribute('id')==='folders-menu') return;
        if(target.nodeName ==="UL") return;
        if(target.nodeName ==="EM" || 
        target.nodeName ==="MARK" || 
        target.nodeName ==="SPAN"
        ){
            target = target.parentNode;
        }else if(target.nodeName ==="LI"){
            target = target.firstElementChild;
        }
        
        //拿到被点击的a对应的数据的id,
        var targetId = target.dataset.id
        //点击每行的div时，去掉之前点击加背景的，给当前被点击的加背景
        getDataIdAddBg(foldersMenu,targetId,divs)

        //拿到被点击的div对应的数据的id,
        var targetId = target.dataset.id
         //传入触发事件的目标div的id,渲染文件层级显示导航的函数
        getIdRenderNav(targetId)
        //找到这个targetId的子级数据渲染成大图文件显示在文件内容区域
        renderBigfolderIcon(Number(targetId))
        //如果点击的文件夹没有内容就给恩建内容主题加个背景提示已经没有文件了
        if(foldersContent.innerHTML.trim()===''){
            foldersContent.classList.add('noChild') 
        }
        /*每次点击树形菜单每一行的div 重新渲染自己文件大图标，
        要清空之前的选中的计数*/
        // folderCheckedNum = 0;
        selectAllIsActive(folderCheckedNum)

        ev.stopPropagation()
    })


//-------------------------渲染文件层级显示导航的函数----------------------------------
    //6.传入被点击的目标的对应的数据以及他的组先数据的数组
    function createFolderNavHtml(navData){
        var navHtml = '<span class="folders-hierarchy-checkbox"></span>';
        for( var i = 0; i < navData.length - 1; i++ ){
            navHtml += `
                <a data-id="${navData[i].id}" class="folderName" href="javaScript:;">${navData[i].title}</a>
                <em class="subordinate">下一层文件图标</em>
            `
        }
        navHtml += `<a data-id="${navData[i].id}" class="active" href="javaScript:;">${navData[navData.length - 1].title}</a>`


        foldersHierarchy.innerHTML = navHtml;
    }

    //7.传入触发事件的目标的id,渲染文件层级显示导航的函数
    function getIdRenderNav(targetId){
        //传入被点击的div数据对应的id,找到它id 对应的数据以及祖先数组
        var arr = getParentsById(targetId)
        //因为数组是从当前这个排到最祖先级数据的，所以要翻转数据再使用
        arr = arr.reverse()
        //传入被点击的目标的对应的数据以及他的组先数据的数组
        createFolderNavHtml(arr)
    }


//--------------文件夹的层级显示导航------------------------------------
    // 文件夹的层级显示导航 的 全选按钮
    var selectAll = foldersHierarchy.querySelector('.folders-hierarchy-checkbox')
foldersHierarchy.addEventListener('click',function(ev){
    var target = ev.target;
//-----------点击文件夹的层级显示导航 左边树形目录高亮------------
    if(target.getAttribute('class')==='subordinate') return;
    if(target.getAttribute('id')==='folders-hierarchy') return;

    if(target.nodeName==='A'){

        //拿到被点击的a对应的数据的id,
        var targetId = target.dataset.id
        //传入触发事件的目标a的id,渲染文件层级显示导航的函数
        getIdRenderNav(targetId)

        //找到这个targetId的子级数据渲染成大图文件显示在文件内容区域
        renderBigfolderIcon(Number(targetId))
        
        //如果点击的文件夹没有内容就给恩建内容主题加个背景提示已经没有文件了
        if(foldersContent.innerHTML.trim()===''){
            foldersContent.classList.add('noChild') 
        }

        /*每次点击导航 重新渲染导航的时候，就表示进到了新的一级文件，
        就清空之前的选中的计数*/
        // folderCheckedNum = 0;
        selectAllIsActive(folderCheckedNum)

        //拿到被点击的a的渲染数据data-id--->targetId,对应找到左边树形目录节点data-id相同的加背景高亮
        getDataIdAddBg(foldersMenu,targetId,divs)
    }
//----------------------------导航全选按钮------------------------------
    if(target.nodeName==="SPAN"){
        //找到大图标文件的选中按钮
        var checkboxs = foldersContent.getElementsByTagName('span');
        var folderItems = foldersContent.getElementsByTagName('li');
        //在有当前文件有文件的时候才可以做单选和全选
        if(checkboxs.length>0){
            //全选按钮点击选中，选中的话点击取消选中
            target.classList.toggle('active')
            //如果全选选中，单选都选中
            if(target.classList.contains('active')){
                for(var i = 0; i < checkboxs.length; i++){
                    //单选按钮
                    checkboxs[i].classList.add('active');
                    //大图标
                    folderItems[i].classList.add('active');
                    //文件名的父级div
                    folderItems[i].lastElementChild.classList.add('active');
                    //文件名的input
                    folderItems[i].lastElementChild.firstElementChild.classList.add('active');
                }
                //全选选中，文件选中的计数变为文件的数目
                folderCheckedNum = checkboxs.length;
            }else{//如果取消选中，单选都取消选中
                for(var i = 0; i < checkboxs.length; i++){
                    //单选按钮
                    checkboxs[i].classList.remove('active')
                    //大图标
                    folderItems[i].classList.remove('active');
                    //文件名的父级div
                    folderItems[i].lastElementChild.classList.remove('active');
                    //文件名的input
                    folderItems[i].lastElementChild.firstElementChild.classList.remove('active');
                }
                //全选取消选中，文件选中的计数变为0
                folderCheckedNum = 0;
            }
        }

    }
})
//-------------------------渲染出文件主体内容显示的大图标---------------------------
//8.传入一个id,找到这个id的子级数据渲染成大图文件显示在文件内容区域
    function renderBigfolderIcon(id){
        //每次重新渲染文件夹的时候，就表示进到了新的一级，就清空当前的选中状态
        folderCheckedNum = 0;
        //渲染的时候，如果大图文件区域如果有背景就取消背景
        if(foldersContent.classList.contains('noChild')){
            foldersContent.removeAttribute('class')
        }
        var html = ''
        //找到传入id所有的子级
        var childs = getChildsById(id);
        if(childs.length>0){
            for(var attr in childs){
                html += `
                <li  data-id="${childs[attr]['id']}" class="folder-item">
                    <span class="tickbox">文件勾选框</span>
                    <div class="foldername">
                        <input type="text" value="${childs[attr]['title']}" disabled="disabled"/>
                    </div>
                </li>
                ` 
            }
        }
        foldersContent.innerHTML = html
    }

//9.传入当前文件的子文件夹，然所有文件夹取消高亮
    function RmoveAllBigFoldersActive(folderItems){
        for( var i = 0; i < folderItems.length; i++){
            if(folderItems[i].classList.contains('active')){
                //大图标
                folderItems[i].classList.remove('active');
                //单选按钮
                folderItems[i].firstElementChild.classList.remove('active');
                //文件名的父级div
                folderItems[i].lastElementChild.classList.remove('active');
                //文件名的input
                folderItems[i].lastElementChild.firstElementChild.classList.remove('active');
            }
        }
    }

//10.单个文件选中
    function checkedFolder(folderItems){
        //大图标
        folderItems.classList.add('active');
        //单选按钮
        folderItems.firstElementChild.classList.add('active');
        //文件名的父级div
        folderItems.lastElementChild.classList.add('active');
        //文件名的input
        folderItems.lastElementChild.firstElementChild.classList.add('active');
    }

//9.传入单选的计数，来计算全选是否选中的函数
    function selectAllIsActive(folderCheckedNum){
        //全选按钮
        var selectAll = foldersHierarchy.querySelector('.folders-hierarchy-checkbox')
        //有子级文件的情况下 
        if(checkboxs.length>0){
                //如果选中的数量<大图标文件的数量，全选就取消选中
                if(folderCheckedNum<checkboxs.length){
                    
                    selectAll.classList.remove('active');
                }
                //如果大图标文件数量和子级选中数量一致，全选按钮全选
                if(folderCheckedNum===checkboxs.length){
                    selectAll.classList.add('active')
                }
        }else{
                selectAll.classList.remove('active')
        }

    }
//-----------文件夹内容   显示区域 事件绑定---------------------------------
//把事件委托给 文件夹内容显示区域 模块容器

    //-----------------------点击文件夹大图标显示下一层文件图标---------
    foldersContent.addEventListener('click',function(ev){
        var target = ev.target;
        //在文件名不可点的情况下，点击文件名也可以进入到下一级
        if(target.nodeName==='INPUT'&&target.getAttribute('disabled')){
            target = target.parentNode.parentNode;
        }
        if(target.nodeName==='LI'){//找到邦定的目标元素li
            //拿到被点击的li对应的数据的id,
            var targetId = Number(target.dataset.id)
            //找到这个targetId的子级数据渲染成大图文件显示在文件内容区域
            renderBigfolderIcon(targetId)
            
            //如果点击的文件夹没有内容就给恩建内容主题加个背景提示已经没有文件了
            if(foldersContent.innerHTML.trim()===''){
                foldersContent.classList.add('noChild') 
            }

            selectAllIsActive(folderCheckedNum)

                //传入触发事件的目标li的id,渲染文件层级显示导航的函数
                getIdRenderNav(targetId)
                
            //点击每行的div时，取消其他div的背景，给当前被点击li的data-id对应的左边的div的data-id相同的元素加背景
            getDataIdAddBg(foldersMenu,targetId,divs)
        }
        
    })

    //--------------------------给文件单选绑定点击事件--------------------------------
    foldersContent.addEventListener('click',function(ev){
        var target = ev.target;
        if(target.nodeName==='SPAN'){
            //单选按钮点击选中，选中的话点击取消选中
            target.classList.toggle('active');
            //父级li高亮
            target.parentNode.classList.toggle('active');
            //文件名高亮
            target.nextElementSibling.firstElementChild.classList.toggle('active');

            //存一个变量，包含n就是true，不包含就是false
            var ifInclude = target.classList.contains('active');
            if(ifInclude){
                folderCheckedNum++;
            }else{
                folderCheckedNum--;
            }
            selectAllIsActive(folderCheckedNum)
        }
    })

//----------------------------框选--------------------------------------------------

    document.onmousedown = function(ev){
        foldersContent.dragbox = null;

        //找到拖拽时候当前的foldersContent里面所有的文件夹
        var folderItems = foldersContent.getElementsByTagName('li');
        
        //如果所在页面没有文件，就不能框选
        if(foldersContent.innerHTML.trim()=='') return;

        //创建框选元素
        var dragSelect = document.createElement('div');

        //获取点击的时候鼠标在可视区域的坐标位置
        var x = ev.clientX;
        var y = ev.clientY;

        document.onmousemove = function(ev){
            //取消浏览器默认行为
            ev.preventDefault();

            //框选只能在foldersContent里面进行
            //定义变量存框选框的高和宽
            var dragSelectH = Math.abs(ev.clientY-y);
            var dragSelectW = Math.abs(ev.clientX-x);

            /*但鼠标按下在foldersContent拖动横坐标超过35，纵坐标超过60认为用户要框选文件
            才创建框选元素*/
            
            if(foldersContent.dragbox){
                    
            }else{
                if(dragSelectH<60&&dragSelectW<35) return;
            }

            //判断款选开始拖的起点在不在大图标文件夹上面，如果再就不能在文件上拖动框选
            var canDrag = dragRange(folderItems,x,y)
            if(!canDrag) return;
            
            //把创建的框选元素放到foldersContent中
            dragSelect.classList.add('dragSelect');
            foldersContent.appendChild(dragSelect);
            dragSelect.style.backgroundColor = 'palegreen';
            foldersContent.dragbox = dragSelect

            //每次拖拽选框显示的时候就取消所有大图标文件的选中状态
            RmoveAllBigFoldersActive(folderItems);

            //文件大图标的选中计数变为0
            folderCheckedNum = 0;

            //框选元素最大不能超过大图标文件区的容器宽高
            var dragSelectMaxH = foldersContent.clientHeight;
            var dragSelectMaxW = foldersContent.clientWidth;
            if(dragSelectH>dragSelectMaxH) dragSelectH=dragSelectMaxH;
            if(dragSelectW>dragSelectW) dragSelectW=dragSelectMaxW;

            

            //框选元素的大小是鼠标按下是鼠标的位置和移动时鼠标位置的差值
            dragSelect.style.width = dragSelectW + 'px';
            dragSelect.style.height = dragSelectH + 'px'

            //框选元素到浏览器可视区域的位置：用鼠标开始和结束位置比较，值小的就说明是框选元素上面（top）和左边（left）最近
            dragSelect.style.left = Math.min(ev.clientX,x) - foldersContent.getBoundingClientRect().left + 'px';
            dragSelect.style.top = Math.min(ev.clientY,y)- foldersContent.getBoundingClientRect().top + 'px';

            
            //调用碰撞元元素,被框选的元素改变颜色
            for( var i = 0; i < folderItems.length; i++){
                if(ElementsCrash(dragSelect,folderItems[i])){
                    checkedFolder(folderItems[i])
                    //没有一个框选被选中，单选计数就加一
                    folderCheckedNum++;
                }
            }
            //调用判断是否要全选的函数
            selectAllIsActive(folderCheckedNum)
        }
        //鼠标抬起
        document.onmouseup = function(){
            document.onmousemove = document.onmouseup = null;
            
            //移出框选元素
            dragSelect.remove();

        }
    }

    //传入当前大图文件区域的文件夹 鼠标down的坐标，判断出是否是在文件夹上拖拽的
    function dragRange(folderItems,x,y){
        var  objRange = [];
        for(var  i = 0; i < folderItems.length; i++){
            objRange.push({
                'l':folderItems[i].getBoundingClientRect().left,
                'r':folderItems[i].getBoundingClientRect().right,
                't':folderItems[i].getBoundingClientRect().top,
                'b':folderItems[i].getBoundingClientRect().bottom,
            })
        }
        for( var attr in objRange ){
            if(x>objRange[attr].l && x<objRange[attr].r && y>objRange[attr].t && y<objRange[attr].b){
        
                return false;
            }
        }
        return true;
    }
//------------------------------------删除文件夹-----------------------------------------------------------
    //用事件委托给父级容器navTool
    navTool.addEventListener('click',function(ev){
        ev.stopPropagation();
        var target = ev.target;
    //-----------------------点击删除文件按钮--------------------------
        if(target.classList.contains('delete') ){
            
            var checkbox = foldersContent.querySelectorAll('li');
            //找到当前被选中的大图文件中有active的class的，然后再从那些中拿到 data-id
            //找到data-id对应的数据，然后找到子孙数据，从对象中删除那些项
            if(checkbox){
                var len = 0;
                //存放被选中要删除文件夹的渲染数据对应的子孙数据的id
                var childsData = [];
                //存放被选中要删除的大图标文件
                var deletedFoldersArr = []
                
                for(var i = 0; i < checkbox.length; i++){
                    if(checkbox[i].classList.contains('active')){
                       len++;
                        //找到这个被选中要删除文件夹的渲染数据的id
                        var deletedFolderId = checkbox[i].dataset.id;
                       
                        //如果要删除，就找到渲染要被删除的文件夹的数据的pid
                        var deletedFolderPid = data[deletedFolderId].pid;
                      
                        //用data-id获取到当前要被删除的文件,放到数组中
                        var deletedFolder = foldersContent.querySelector(`li[data-id="${deletedFolderId}"]`)
                        deletedFoldersArr.push(deletedFolder)

                        //找到被选中要删除文件夹的渲染数据对应的子孙数据的id
                        childsData = childsData.concat(findDescendantId(deletedFolderId)).concat(deletedFolderId)
                        //每找到要删除一个文件，选中计数的变量自减，并且调用是否全选的函数判断是否要全选
                        folderCheckedNum--;
                    }
                }
                
                /*循环 被选中要删除文件夹的渲染数据对应的子孙数据的id
                    和 data数据对比，id在data中重合的就删除
                */
               //如果有要被选中要删除的文件
               if(deletedFoldersArr.length!==0){
                    //就 弹出确认删除的提示框
                    cover.style.display = 'block';
                    deleteEnsureBox.style.display = 'block';
                    //找到统计总共有几个文件被删除
                    var countDeletedFolders =deleting.lastElementChild.lastElementChild
                    countDeletedFolders.innerHTML = '/'+childsData.length;

                    deleteEnsureBox.addEventListener('click',function(ev){
                        
                        var target = ev.target;
            //-------------------点击确认删除按钮---------------
            
                        if(target.classList.contains('ensure')){

                            //就拿要删除的子孙数据和原始数据进行对比并且删除
                            for(var i = 0; i < childsData.length; i++){
                                
                                for( var attr in data ){
                                    if(data[attr].id==childsData[i]){
                                         delete data[attr]
                                    }
                                }
                           }
                           //选中要删除的文件删除之后，关闭删除提示框
                           deleteEnsureBox.style.display = 'none';

                            //弹出删除几个文件计数计数的提示
                            deleting.style.display = 'block';
                            var totalDelete = deleting.lastElementChild.lastElementChild;
                            totalDelete.innerHTML = '/'+len;
                            var countDown = totalDelete.previousElementSibling;
                            countDown.innerHTML = 0;
                            
                            //删除几个文件计数计数的提示关闭，遮罩隐藏，头部区域弹出删除成功
                            animate(deleting,{opacity:1},500,'linear',function(){
                                animate(deleting,{opacity:1},100,'linear',function(){
                                    deleting.style.display = 'none';
                                    cover.style.display = 'none';
                                    //提示新建成功
                                    FirstShowNextDispear(operationSucessfull)
                                    operationSucessfull.innerHTML = '文件删除成功';
                                })
                            })

                           //在data中删除要找到要删除的子孙数据后重新渲染树形菜单
                           foldersMenu.innerHTML = createHtml(data,initalId,level,initalH,initalPl)
                           //删除选中的大图标文件
                           for( var i = 0; i < deletedFoldersArr.length; i++){
                               deletedFoldersArr[i].remove()
                           }

                           //删除文件之后给树形菜单高亮的是被删除这个文件夹的父级
                           getDataIdAddBg(foldersMenu,deletedFolderPid,divs)
                           selectAllIsActive(folderCheckedNum);

                           if(!foldersContent.innerHTML.trim()){
                            foldersContent.classList.add('noChild')
                           }
                        }
            //-------------------点击  取消删除按钮   关闭按钮---------------
                        //如果点击取消，就不删除数据，关闭提示框
                        if(target.classList.contains('cancel')||
                           target.classList.contains('close')
                        ){
                           deleteEnsureBox.style.display = 'none';
                           cover.style.display = 'none';
                            folderCheckedNum = cancelDeleteFoldersNum;
                            selectAllIsActive(folderCheckedNum)
                        }
                    })
               }else{//如果没有选中文件
                //提示请选择文件
                 FirstShowNextDispear(pleaseSeletFolder)
                 pleaseSeletFolder.innerHTML = '请选择要删除文件'
               }
            }
            
        }
        
    })
    
//---------------------------新建文件夹------------------------------------------------
    //用事件委托给父级容器navTool
    navTool.addEventListener('click',function(ev){
        ev.stopPropagation();
        var target = ev.target;
        //点击新建文件夹按钮
        if(target.classList.contains('create')){
            //点新建的时候页面选中的都取消选中
            //点击选中的文件的个数
            folderCheckedNum = 0;
            //新建页面的文件都取消选中的高亮
            RmoveAllBigFoldersActive(folderItems);
            //调用判断是否全选的函数
            selectAllIsActive(folderCheckedNum);
            //声明一个对象存放新建文件夹的渲染数据
            // var obj = {}
            //声明一个变量存新建文件夹的渲染数据对象的id
           var objId = getNewFolderId(data);

            var title = '新建文件夹';
            foldersContent.innerHTML += `
                <li data-id="${objId}" class="folder-item">
                    <span class="tickbox">文件勾选框</span>
                    <div class="foldername">
                        <input type="text" value="${title}" />
                    </div>
                </li>
            `;
            
            //如果新建文件的那个文件是没有内容的，就先取消文件区域背景【提示没有文件的背景】
            if(getComputedStyle(foldersContent).backgroundImage){
                foldersContent.classList.remove('noChild')
            }
            //找到当前新建的文件夹
            var NewFolder = foldersContent.querySelector(`li[data-id="${objId}"]`)
            //传入新建文件夹和文件夹名字，让文件夹名获取焦点并且可以修改，重新渲染文件夹名和属性菜单
            modifyFolderName(NewFolder,title)
        }
    })

//-----------------------------重命名--------------------------------------------------------
    navTool.addEventListener('click',function(ev){
        var target = ev.target;
        
        //存被选中要重命名的文件夹的数量
        var activeNum = 0;
        //存被选中要重命名的文件
        var renameFolder = null;
        var tiptext = '文件重命名'
        //点击重命名文件夹按钮
        if(target.classList.contains('rename')){
            pleaseSeletFolder.innerHTML = '请选择要重命名的文件'
            if(folderItems.length>0){//需要文件夹内容去有内容才执行
                for(var i = 0; i < folderItems.length; i++){
                    
                    if(folderItems[i].classList.contains('active')){
                        activeNum++;
                        renameFolder = folderItems[i];
                    }
                }
                
                if(activeNum>1){
                    alert('只能选择一个文件夹重命名哦~');
                    folderCheckedNum = 0;
                    // 文件夹的层级显示导航 的 全选按钮
                    var selectAll = foldersHierarchy.querySelector('.folders-hierarchy-checkbox')
                    selectAll.classList.remove('active')
                    RmoveAllBigFoldersActive(folderItems)
                }else if(activeNum==0){
                   //提示请选择要重命名的文件
                    FirstShowNextDispear(pleaseSeletFolder)
                }else if(activeNum==1){
                    //传入文件夹和文件夹名字，让文件夹名获取焦点并且可以修改，重新渲染文件夹名和属性菜单
                    modifyFolderName(renameFolder,tiptext)
                }   
            }
        }
    })

    //传入文件夹和文件夹名字，让文件夹名获取焦点并且可以修改，重新渲染文件夹名和属性菜单
    function modifyFolderName(folder,tiptext){
        //拿到当前要修改的文件夹的渲染数据的pid
        var pid =Number(foldersHierarchy.lastElementChild.dataset.id);
        //文件夹的文件名
        var FolderName = folder.lastElementChild.firstElementChild;
        //存一下修改之前的文件名
        var titleBoforeModify = FolderName.value;
        //拿到要修改的文件夹的data-id
        var folderId = folder.dataset.id;
        
        FolderName.removeAttribute('disabled')
        
        //让文件夹的名字自动获取焦点
        FolderName.focus()
        FolderName.select()
        //文件名input高亮
        FolderName.classList.add('onfocus');
        //文件名失去焦点
        FolderName.onblur = function(ev){
            title = FolderName.value;
            if(FolderName.value.trim()){//如果输入的名字是有内容的
                if(titleIsRepeat(pid,title)){//调用函数检测是否重复，如果文件名没有重复
                    if(tiptext.trim()=='新建文件夹'){//如果是新建文件夹的时候
                        var obj = {}
                        //写新建文件夹的数据
                        obj.id = Number(folderId);
                        obj.pid = pid;
                        obj.title = `${title}`;
                        obj.type = 'file'
                        data[folderId] = obj;
                        
                    }else if(tiptext.trim()=='文件重命名'){//如果是文件重命名
                        //在数据中修改文件名
                        data[folderId].title = `${title}`;
                    }
                    
                    //重新渲染左边的目录
                    foldersMenu.innerHTML = createHtml(data,initalId,level,initalH,initalPl);
                    //文件名input高亮取消
                    FolderName.classList.remove('onfocus');
                    
                    renderBigfolderIcon(pid)
                    //提示新建成功
                    operationSucessfull.innerHTML = `${tiptext}成功`;
                    FirstShowNextDispear(operationSucessfull)
                }else{//如果文件名重复
                    //文件名失去焦点的时候，文件名和文件的处理
                    aboutFolderName(folder,tiptext,FolderName,titleBoforeModify)
                }
            }else{//如果输入的名字被删空
                //文件名失去焦点的时候，文件名和文件的处理
                aboutFolderName(folder,tiptext,FolderName,titleBoforeModify)
            }
            selectAllIsActive(folderCheckedNum)
        }
    }

    //enter控制文件名修改的时候失去焦点
    document.addEventListener('keyup',function(ev){
         if(ev.keyCode===13){
             //找到获取焦点的元素，按enter键的时候取消焦点
             var actveInp = foldersContent.querySelector('.onfocus')
            if(actveInp){
                actveInp.blur()
                actveInp.classList.remove('onfocus');
                RmoveAllBigFoldersActive(folderItems)
            }
         }
    })
    
    //文件名失去焦点的时候，文件名和文件的处理
    function aboutFolderName(folder,tiptext,FolderName,titleBoforeModify){
        if(tiptext.trim()=='新建文件夹'){//在新建文件夹的时候
            folder.remove();
        }else if(tiptext.trim()=='文件重命名'){//在重命名的时候
            RmoveAllBigFoldersActive(folderItems)
            //文件名input高亮
            FolderName.value = titleBoforeModify;
            FolderName.classList.remove('onfocus');
        }
        operationSucessfull.innerHTML = `${tiptext}失败`
        FirstShowNextDispear(operationSucessfull);        
    }
//--------------------------移动到---------------------------------------------------------------

    //用来存选中要移动的文件夹渲染的数据的id值
    var moveArr = [];

    navTool.addEventListener('click',function(ev){
        var target = ev.target;
        //统计被选中要移动的文件数量
        var activeNum = 0;
        //用来存要移动的文件夹的渲染数据的pid-->就是父级文件的id
        var beforeMovePid = null;
        if(target.classList.contains('moveTo')){
            moveArr = [];
            
            if(folderItems.length>0){//需要文件夹内容去有内容才执行
                //隐藏不符合要求的提醒条
                repeatAlert.style.display = 'none';

                for(var i = 0; i < folderItems.length; i++){
                    
                    if(folderItems[i].classList.contains('active')){
                        activeNum++;
                        moveArr.push(Number(folderItems[i].dataset.id));
                    }
                }
                
                if(activeNum===0){//如果没有选中的文件夹
                    //提示请选择文件
                     FirstShowNextDispear(pleaseSeletFolder)
                     pleaseSeletFolder.innerHTML = '请选择要移动的文件'
                }else{//如果有选中的文件夹
                    //渲染文件移动到的目录缩小版树型目录
                    var initalH = 35;
                    var initalPl = 16;
                    //被选中文件夹的父级文件夹的title放到currentParentFolder里面
                    
                    var beforeMovePid = data[moveArr[0]].pid;
                    currentParentFolder.innerHTML = data[beforeMovePid].title
                    
                    //文件移动到 选择框 显示并渲染出来缩小版的目录
                    cover.style.display = 'block';
                    moveToNewPosition.style.display = 'block';
                    currentSmallMenu.innerHTML = createHtml(data,initalId,-1,initalH,initalPl);

                     //点击缩小版树型目录文件名 让其高亮
                    currentSmallMenu.addEventListener('click',choosefoldInMenu);
                    
                    //点击确认按钮和取消按钮
                    moveToNewPosition.addEventListener('click',ensureOrCancel);

                }  
            }
        } 
    })  
    

    /*传入被移动文件的pid-->pid1和选择移动到的文件的id--->targetId
    判断选择的要移动到的文件夹是否符合要求
    */
    function moveUnstandard(pid1,targetId){
        var arr111 = [];
        
        repeatAlert.style.display = 'none';
        
        if(targetId==pid1){
            repeatAlert.style.display = 'block';
            repeatAlert.innerHTML = '已经在该文件夹下';
            return false;
        }else{
            for(var i = 0; i < moveArr.length; i++){
                arr111 = arr111.concat(findDescendantId(moveArr[i])).concat(moveArr[i])
            }
            for(var i = 0; i < arr111.length; i++){
                if(arr111[i]==targetId){
                    repeatAlert.style.display = 'block';
                    repeatAlert.innerHTML = '不能将文件移动到自身或其子文件夹下';
                    return false;
                }
            }
        }
        return true;
    }

    //点击缩小版树型目录文件名 让其高亮
    function choosefoldInMenu(ev){
        //触发事件的节点
        var target = ev.target;
        //把触发事件的节点加到每行的div上
        //如果点击道德是树形菜单的父级 或者是ul就无效
        if(target.getAttribute('class')==='currentSmallMenu') return;
        if(target.nodeName ==="UL") return;
        if(target.nodeName ==="EM" || 
        target.nodeName ==="MARK" || 
        target.nodeName ==="SPAN"
        ){
            target = target.parentNode;
        }else if(target.nodeName ==="LI"){
            target = target.firstElementChild;
        }
        
        //拿到被点击的div对应的数据的id,
        var targetId = target.dataset.id
        //找到移动到的缩小版目录里面的每行文件名的div
        var divs1 = currentSmallMenu.getElementsByTagName('div');
        //点击每行的div时，去掉之前点击加背景的，给当前被点击的加背景
        getDataIdAddBg(currentSmallMenu,targetId,divs1)
        //被移动文件夹的pid
        var beforeMovePid = foldersHierarchy.lastElementChild.getAttribute('data-id');
        moveUnstandard(beforeMovePid,targetId)
    }
   
    //点击确认按钮和移动按钮
    function ensureOrCancel(ev){
        var target = ev.target;
        //点击确认移动按钮
        if(target.classList.contains('ensureToMove')){
            
            //1.把渲染被选中文件的数据的pid改为要移动到的文件夹的id
            //2.找到被删除文件夹的父级的id，重新渲染这个文件区域的文件展示
            //3.重新渲染左边的树形菜单

            //如果有选中移动到某个文件夹
            if(currentSmallMenu.activeChild){
                //拿到要移动到的文件夹的id,作为文件的pid
                var newPid = currentSmallMenu.activeChild.dataset.id;
                //被移动文件夹的pid
                var beforeMovePid = foldersHierarchy.lastElementChild.getAttribute('data-id');
                
                //循环数据data找到要移动的文件夹的渲染数据，修改pid
                if(moveUnstandard(beforeMovePid,newPid)){
                    
                    for(var i = 0; i < moveArr.length; i++){
                        
                        var name = data[moveArr[i]].title
                        var nameIsDifferent = titleIsRepeat(newPid,name);
                        //判断移动的文件夹跟新的文件夹里面的文件名字有没有重复
                        if(nameIsDifferent){

                        }else{//如果 有重复的文件名的，移入的文件名后面加1
                            data[moveArr[i]].title =  data[moveArr[i]].title+'1';
                        }
                        data[moveArr[i]].pid = Number(newPid);
                        
                    }
                }
                
                //移动文件的数据处理之后
                //重新渲染大图文件区
                renderBigfolderIcon(beforeMovePid);
                var selectAll = foldersHierarchy.querySelector('.folders-hierarchy-checkbox');
                //如果当前文件夹下的子文件被移动空了，就取消全选按钮，背景提示‘暂无文件’
                if(!foldersContent.innerHTML.trim()){
                    foldersContent.classList.add('noChild');
                    selectAll.classList.remove('active');
                    folderCheckedNum = 0;
                }
                //重新渲染左边的树形菜单
                //树形菜单第一层级的div高度是45px，层级越低数值越小 递减3px
                var initalH = 45;
                //树形菜单第一层级的div的padding-left是20px,层级越低数值越大 递增28
                var initalPl = 20;
                //重新渲染左边的树形菜单
                foldersMenu.innerHTML = createHtml(data,initalId,-1,initalH,initalPl);
                moveToNewPosition.style.display = 'none';
                cover.style.display = 'none';
                //提示移动成功
                FirstShowNextDispear(operationSucessfull)
                operationSucessfull.innerHTML = '文件移动成功'

            }else{//如果没有选择移动到哪里，就提醒要移动到哪里
                FirstShowNextDispear(pleaseSeletFolder)
                pleaseSeletFolder.innerHTML = '请选择储存位置'
            }
        }
        //点击取消移动按钮
        if(target.classList.contains('cancelToMove')||
           target.classList.contains('MoveBoxClose')
        ){
            
            moveToNewPosition.style.display = 'none';
            cover.style.display = 'none';
        }
    }

    






















}