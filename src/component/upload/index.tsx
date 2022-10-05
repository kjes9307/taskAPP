import { ChangeEvent, FC ,useRef, useState} from 'react'
import axios from 'axios';
import {UploadList} from './uploadList'
import Icon from 'component/Icon'

// 檢查大小 檔案類型 
// 可訂製header
// 設定檔案上傳key值
// 可以預覽檔案
interface UploadProps {
    action: string;    
    defaultFileList?: UploadFile[];
    beforeUpload? : (file: File) => boolean | Promise<File>
    onProgress?: (percentage: number, file: File) => void;
    onSuccess?: (data: any, file: File) => void;
    onError?: (err: any, file: File) => void;
    onChange?: (file: File) => void;
    onRemove?: (file: UploadFile) => void;
    accept?: string
    headers?: {[key:string]:any}
    multiple?:boolean
    fileKey?:string; 
}

export type UploadFileStatus = 'ready' | 'uploading' | 'success' | 'error' | 'onPreview'

export interface UploadFile {
    uid: string;
    size: number;
    name: string;
    status?: UploadFileStatus;
    percent?: number;
    raw?: File;
    response?: any;
    error?: any;
    data_url?:string
}
export const UploadFile: FC<UploadProps> = (props) =>{
    const {
        action,
        defaultFileList,
        onProgress,
        onSuccess,
        onError,
        beforeUpload,
        onChange,
        onRemove,
        accept,
        headers,
        multiple,
        fileKey
    } = props
    const fileInput = useRef<HTMLInputElement>(null)
    const [ fileList, setFileList ] = useState<UploadFile[]>(defaultFileList || [])
    const [file,setFile] = useState<string|null>(null)

    // 0 . 觸發上傳
    const handleClick = () => {
        // button 觸發 input上傳
        if (fileInput.current) {
            fileInput.current.click()
        }
    }
    // 1. input file 接收更新
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        // 文件上傳
        if(!files){
            return
        }
        uploadFiles(files)
        if(fileInput.current){
            fileInput.current.value = ""
        }
    }
    // 2. 上傳檔案
    const uploadFiles = (files: FileList) => {
        // 將FileList 轉成一個 array
        let postFiles = Array.from(files)
        postFiles.forEach(file => {
            if(beforeUpload){ 
                const result = beforeUpload(file)
                if (result !== false){
                    onViewFile(file)
                }
            }
        }
    )
   }
   // extra file Preview 
   const onViewFile = (file: File) =>{
        let _file: UploadFile = {
            uid: Date.now() + 'upload-file',
            status : 'onPreview',
            name: file.name,
            size: file.size,
            percent: 0,
            raw: file,
            data_url:""
        }
        console.log(_file.raw)
        const myReader = new FileReader()
        myReader.addEventListener('load',()=>{
            _file.data_url=myReader.result as string
            setFileList(prevList => [_file, ...prevList])
        },false)
        myReader.readAsDataURL(file)
   }
   // 4. 上傳&axios&監測更新
   const post = (file: File) => {
    let _file: UploadFile = {
        uid: Date.now() + 'upload-file',
        status : 'ready',
        name: file.name,
        size: file.size,
        percent: 0,
        raw: file
    }
    setFileList([_file, ...fileList])
    const formData = new FormData()
    formData.append(fileKey || 'fileKey', file)
    // axios.post(action, formData, {
    //     headers: {
    //     ...headers,
    //     'Content-Type': 'multipart/form-data'
    //     },
    //     onUploadProgress: (e) => {
    //         console.log(e)
    //         let percentage = Math.round((e.loaded * 100) / e.total) || 0;
    //         // 希望在上傳過程用state監測
    //         if(percentage < 100){
    //             updateFileList(_file, { percent: percentage, status: 'uploading'})
    //             if (onProgress){
    //                 onProgress(percentage, file)
    //             }
    //         }
    //     }
    // }).then(resp => {
    //     console.log(resp)
    //     updateFileList(_file,{status: 'success', response: resp.data})

    //     if(onSuccess){
    //         onSuccess(resp.data, file)
    //     }
    //     if(onChange) {
    //         onChange(file);
    //     }
    // }).catch(err => {
    //     console.error(err)
    //     updateFileList(_file, {status: 'error', error: err})

    //     if(onError){
    //         onError(err, file)
    //     }
    //     if(onChange) {
    //         onChange(file);
    //     }
    // })
    }
    const updateFileList = (updateFile: UploadFile, updateObj: Partial<UploadFile>) => {
        setFileList( prevList => {
            return prevList.map(file => {
                if (file.uid === updateFile.uid) {
                    return {...file, ...updateObj}
                }else {
                    return file;
                }
            })
        })
    }
    
    const handleRemove = (file: UploadFile) => {
        setFileList((prevList) => {
            return prevList.filter(item => item.uid !== file.uid)
        })
        if (onRemove){
            onRemove(file)
        }
    }
    return (
        <div>
            <div 
              onClick={handleClick}
              className='d-flex align-items-center justify-content-center border'
              style={{cursor:"pointer",width: 100,height:100,objectFit:"cover"}}
              >
              <Icon icon='plus' />
            </div>
            <input
                style={{display: 'none'}}
                ref={fileInput}
                onChange={handleFileChange}
                type = "file"
                accept={accept}
                multiple={multiple}
            />
            <UploadList
                fileList={fileList}
                onRemove={handleRemove}
            />
        </div>
    )
}