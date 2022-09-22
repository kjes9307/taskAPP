import React, { useState, useEffect, ReactNode } from 'react';
import {ProgressBar } from "react-bootstrap"
import { v4 as uuid } from 'uuid'
const id: string = uuid();
interface DataType {
    id?: string;
    name?: string;
    done?: boolean;
    todoList?: DataType[];
    status?: boolean;
    item?: DataType;
  }
  const todoContext = React.createContext<
    | {
        todo: DataType[];
        count: number;
        addItem: (e: DataType) => void;
        updateItem: (id: string, status: boolean) => void;
        editItem: (id: string, newName: string) => void;
        checkAllItem: (status: boolean) => void;
        delItem: (id: string) => void;
      }
    | undefined
  >(undefined);
  
  const TodoProvider = ({ children }: { children: ReactNode }) => {
    let initArray: DataType[] = [
      { id: uuid(), name: "Example", done: false },
      { id: uuid(), name: "Task2", done: true }
    ];
    const [todo, setTodo] = useState(initArray);
    const [count, setCount] = useState(0);
    const addItem = (obj: DataType) => {
      obj["id"] = uuid();
      obj["done"] = false;
      setTodo([...todo, obj]);
    };
    const updateItem = (id: string, status: boolean) => {
      const nowTodo = [...todo]; // 變數記憶體位置改變 才比對的到?
      nowTodo.forEach((x) => {
        if (x.id === id) x.done = status;
      });
      setTodo(nowTodo);
    };
    const editItem = (id:string,newName:string)=>{
      console.log(id,newName)
      const nowTodo = [...todo];
      nowTodo.forEach((x) => {
        if (x.id === id) x.name = newName;
      });
      setTodo(nowTodo);
    }
    const delItem = (id: string) => {
      let newTodo = todo.filter((x) => {
        return x.id !== id;
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
  
    useEffect(() => {
      console.log("@count");
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
    // console.log(context);
    if (!context) {
      throw new Error("要在Provider中使用");
    }
    return context;
  };
  export const TodoList = () => {
    return (
      <>
        <TodoProvider>
          <div className="w-100">
            <Footer />
            <Contain />
            <Header />
          </div>
        </TodoProvider>
      </>
    );
  };
  export const Header = () => {
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
            className='w-100'
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
                <div className={nav === idx? `nav-link active d-flex align-items-center justify-content-between`: `nav-link d-flex align-items-center justify-content-between`}>
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
              <li key={item.id} className="list-group-item py-1 px-0">
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
      editItem(item?.id as string,e.target.value)
    }
    const { item } = props;
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
        <div className='d-flex'>
        <input
          onChange={(e) => check(e, item?.id || "")}
          type="checkbox"
          checked={item?.done}
          className='checkList'
        />
        {!mode?
          <span className='ms-2' onClick={()=>setModeEdit(!mode)}>{item?.name || null}</span>
         : 
         <>
         <div>
          <textarea 
            className='w-100 text-checklist ms-2' 
            value={value} 
            autoFocus
            onBlur={() => {
              setModeEdit(!mode)
            }}
            onChange={(e)=> handChange(e)}></textarea>
         </div>
       </>
        }
        </div>
        <div onClick={() => deleteTodo(item?.id as string)}>
          X
        </div>
      </div>
    );
  };
  export const Footer = () => {
    // console.log("@footer")
    const { checkAllItem, todo: todoList, count: Count } = useProvider();
  
    const checkAll = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (window.confirm(e.target.checked === true ? "全選?" : "捨棄選取?"))
        checkAllItem(e.target.checked);
    };
    let percent = (Count / todoList?.length)*100 || 0
    return (
        <ProgressBar now={percent} className='mt-2 mb-2' />
    );
  };