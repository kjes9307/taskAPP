import React, { useState, useEffect, ReactNode } from 'react';
import {ProgressBar } from "react-bootstrap"
import {useAddList,useEditList} from './util'
// 需求分析
// 送出API => 需要task ID
// taskList狀態 => 完成 代辦 刪除
type listData = {
  name?:string,
  done?: false|true
  _id?:string
}
interface DataType {
    _id?: string;
    name?: string;
    done?: boolean;
    todoList?: listData[];
    status?: boolean;
    item?: DataType;
  }
  const todoContext = React.createContext<
    | {
        todo: listData[];
        count: number;
        addItem: (e: listData) => void;
        updateItem: (id: string, status: boolean) => void;
        editItem: (_id: string, newName: string) => void;
        checkAllItem: (status: boolean) => void;
        delItem: (id: string) => void;
      }
    | undefined
  >(undefined);
  
  const TodoProvider = ({ children,list,taskId }: { children: ReactNode,list:listData[],taskId:string }) => {
    const {mutateAsync:addListAsync}=useAddList(taskId)
    const [todo, setTodo] = useState<listData[]>(list);
    const [count, setCount] = useState(0);
    const addItem = async(obj:listData) => {
      obj["done"] = false;
      setTodo([...todo, obj]);
      await addListAsync(obj)
    };
    const updateItem = (id: string, status: boolean) => {
      const nowTodo = [...todo]; // 變數記憶體位置改變 才比對的到?
      nowTodo.forEach((x) => {
        if (x._id === id) x.done = status;
      });
      setTodo(nowTodo);
    };
    const editItem = (_id:string,newName:string)=>{
      const nowTodo = [...todo];
      nowTodo.forEach((x) => {
        if (x._id === _id) x.name = newName;
      });
      setTodo(nowTodo);
      // await editListAsync({_id,name:newName})
    }
    const delItem = (id: string) => {
      let newTodo = todo.filter((x) => {
        return x._id !== id;
      });
      setTodo(newTodo);
    };
    const checkAllItem = (status: boolean) => {
      const nowTodo = [...todo];
      nowTodo.forEach((x) => {
        x.done = status;
      });
      setTodo(nowTodo);
    };
    // After app receives data , useEffect func updates empty array directly
    useEffect(()=>{
      setTodo(list)
    },[list])
    useEffect(() => {
      let Count = todo?.reduce((pre, cur) => {
        return pre + (cur.done === true ? 1 : 0);
      }, 0);
      setCount(Count);
    }, [todo]);
    return (
      <todoContext.Provider
        value={{ todo, count, addItem, updateItem, checkAllItem, delItem,editItem }}
      >
        {children}
      </todoContext.Provider>
    );
  };
  const useProvider = () => {
    const context = React.useContext(todoContext);
    if (!context) {
      throw new Error("要在Provider中使用");
    }
    return context;
  };
  export const TodoList = (props:{TaskId:string,taskTodoList:listData[] }) => {
    const {TaskId, taskTodoList} = props
    console.log("render")
    return (
      <>
        <TodoProvider taskId={TaskId} list={taskTodoList}>
          <div className="w-100">
            <Header />
            <Contain />
            <Footer />
          </div>
        </TodoProvider>
      </>
    );
  };
  export const Footer = () => {
    const [newItem, setAddItem] = useState("");
    const { addItem } = useProvider();
    const isVoid = (value: unknown) =>
      value === undefined || value === null || value === "";
  
    const handleInput = (e:React.KeyboardEvent<HTMLTextAreaElement>)=>{
      
      if(e.key==='Enter') {
        if (isVoid(newItem.trim())) {
          return alert("想裝忙? 還沒輸入項目呢!!");
        }
        let obj = {
          name: newItem
        };
        addItem(obj);
        setAddItem("");
      }
    }
    return (
      <div className='mt-2'>
          <textarea
            onKeyPress={(e)=>handleInput(e)} 
            className='w-100 text-addItem form-control'
            placeholder="新增待辦"
            onChange={(e) => setAddItem(e.target.value)}
            value={newItem}
          />
      </div>
    );
  };
  export const Contain = () => {
    const { todo: todoList } = useProvider();
    const [nav,setNav] = useState(0)
    const [defaultNav,setNavArr] = useState(['CheckList'])
    return (
      <>
      <ul className="nav nav-tabs d-flex align-items-center">
        {
          defaultNav?.map((item,idx)=>{
            return (
              <li className="nav-item" onClick={()=> setNav(idx)}>
                <div className={nav === idx? `nav-link active text-primary d-flex align-items-center justify-content-between`: `nav-link text-dark d-flex align-items-center justify-content-between`}>
                  {item}
                  <span 
                    className="material-symbols-outlined" 
                    style={{cursor:"pointer"}}
                    onClick={()=>{
                      let del = defaultNav
                      del.pop()
                      setNavArr([...del])
                    }}
                  >
                    delete
                  </span>
                </div>
              </li>
            )
          })
        }
        <span 
          className="material-symbols-outlined" 
          style={{cursor:"pointer"}}
          onClick={()=> setNavArr([...defaultNav,"CheckList"])}
          >
          add
        </span>
      </ul>
      <ul className='list-group list-group-flush'>
        {todoList?.length !== 0 ? (
          todoList?.map((item) => {
            return (
              <li key={item._id} className="list-group-item py-1 px-0">
                <Item item={item} />
              </li>
            );
          })
        ) : (
          <li className="list-group-item">No data</li>
        )}
      </ul>
      </>
      
    );
  };
  export const Item = (props: DataType) => {
    const { item } = props;
    const [display, showDisplay] = useState(false);
    const [mode, setModeEdit] = useState(false)
    const [value,setNewName] = useState('')
    const { updateItem, delItem, editItem } = useProvider();
  
    const mouseEvent = (event: boolean) => {
      showDisplay(event);
    };
    const check = (event: React.ChangeEvent<HTMLInputElement>, id: string) => {
      if (id === "") return;
      updateItem(id, event.target.checked);
    };
    const deleteTodo = (id: string) => {
      if (window.confirm("確定") === true) {
        delItem(id);
      }
    };
    const handChange = (e:React.ChangeEvent<HTMLTextAreaElement>) =>{
      setNewName(e.target.value);
      editItem(item?._id as string,e.target.value)
    }
    useEffect(()=>{
      setNewName(item?.name || '')
    },[])
    return (
      <div
        className='d-flex align-items-center justify-content-between'
        style={{
          backgroundColor: display ? "#ddd" : "white"
        }}
        onMouseEnter={() => mouseEvent(true)}
        onMouseLeave={() => mouseEvent(false)}
      >
        <div className='d-flex w-80'>
        <input
          onChange={(e) => check(e, item?._id || "")}
          type="checkbox"
          checked={item?.done}
          className='form-check-input'
        />
        {!mode?
          <span className='ms-2' onClick={()=>setModeEdit(!mode)}>{item?.name || null}</span>
         : 
         <>
          <textarea 
            className='w-100 text-checklist ms-2 form-control' 
            value={value} 
            autoFocus
            onBlur={() => {
              setModeEdit(!mode)
            }}
            onKeyDown={(e)=>{
              if(e.key==="Enter"){
                setModeEdit(!mode)
              }
            }}
            onChange={(e)=> handChange(e)}>
            </textarea>
          </>
        }
        </div>
        <div onClick={() => deleteTodo(item?._id as string)}>
          X
        </div>
      </div>
    );
  };
  export const Header = () => {
    const { todo: todoList, count: Count } = useProvider();

    let percent = (Count / todoList?.length)*100 || 0
    return (
        <ProgressBar now={percent} className='mt-2 mb-2' />
    );
  };