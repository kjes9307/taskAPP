import { FC,useState,useRef,useEffect,RefObject } from "react";
import ReactCrop , {Crop,PixelCrop} from 'react-image-crop'
import axios from 'axios';
import 'react-image-crop/dist/ReactCrop.css'
import { UploadFile } from './index'
import Icon from 'component/Icon'
import {ProgressBar,Modal,Button} from 'react-bootstrap'
import './style.scss'

interface UploadListProps {
    fileList: UploadFile[];
    onRemove: (_file: UploadFile) => void;
}
// canvasRef , imgUrl , cropPixel

const EditImage = (props:{img:UploadFile,show:boolean,handleClose:()=>void}) => {
    const {
        img,
        show,
        handleClose
    } = props
    const canvasRef = useRef<HTMLCanvasElement|null>(null)
    const imgRef = useRef<HTMLImageElement|null>(null)

    const [crop, setCrop] = useState<Crop>({
        unit: 'px',
        x: 25,
        y: 25,
        width: 50,
        height: 50
      })
    const onHandleCrop = (e:PixelCrop) =>{
        setCrop(e)
    } 
    const handleImgFile =() =>{
        if(canvasRef.current&&canvasRef){
        const canvas = canvasRef.current
        // let file = canvas.toBlob('image/png',1)
        // const formData = new FormData()
        // formData.append('fileKey', file)
        // axios.post('http://localhost:3000/user/uploadImg', formData, {
        //     headers: {
        //     'Content-Type': 'multipart/form-data'
        //     },
        // }).then(resp => {
        //     console.log(resp)
        // }).catch(err => {
        //     console.error(err)
        // })
        }
        
    }
    function image64toCanvasRef (canvaRef:RefObject<HTMLCanvasElement>, image64:string, pixelCrop:Crop,imgRef:RefObject<HTMLImageElement>) {
        if(canvaRef && canvaRef.current && image64){
            const canvas = canvaRef.current 
            canvas.width = pixelCrop.width
            canvas.height = pixelCrop.height
            let scaleX:number;
            let scaleY:number;
            if(imgRef&&imgRef.current){
                scaleX = imgRef.current.naturalWidth / imgRef.current.width;
                scaleY = imgRef.current.naturalHeight / imgRef.current.height;
            }
            const ctx = canvas.getContext('2d')
            if(!ctx) return;
            const image = new Image()
            image.src = image64
            image.onload = function () {
                ctx.drawImage(
                    image,
                    pixelCrop.x * scaleX,
                    pixelCrop.y * scaleY,
                    pixelCrop.width * scaleX,
                    pixelCrop.height * scaleY,
                    0,
                    0,
                    pixelCrop.width,
                    pixelCrop.height 
                )
            }
        }
    }
    useEffect(()=>{
        if (canvasRef.current) {
            image64toCanvasRef(canvasRef,img?.data_url as string,crop,imgRef)
        }
    },[crop])
    return (
      <>
        <Modal size='xl' show={show} onHide={handleClose}>
          <Modal.Body>
        <div className="d-flex justify-content-between align-items-center">
        <ReactCrop crop={crop} aspect={4/3} onChange={e => onHandleCrop(e)}>
                <img ref={imgRef} src={img?.data_url} className="crop-img" />
          </ReactCrop>
        <canvas ref={canvasRef} style={{objectFit:"contain",width:320,height:240}}></canvas>

        </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button onClick={handleImgFile}>
                OK
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
// 13. 上傳列表
export const UploadList: FC<UploadListProps> = (props) => {
    const {
        fileList,
        onRemove,
    }  = props
    const [show, setShow] = useState(false);
    const [img,setData] = useState<UploadFile|undefined>(undefined);
    const handleClose = () => setShow(!show);
    const handImageData = (data:UploadFile) =>{
        setShow(!show)
        setData(data)
    }
    return (
        <ul className="list-unstyled">
            {fileList.map(item => {
                return (
                    <li key={item.uid}>
                        <span className={`file-name file-name-${item.status} me-2`}>
                            <Icon icon="file-alt" theme="secondary" />
                            {item.name}
                        </span>
                        <span className = "file-status">
                            {(item.status === 'uploading' || item.status === 'ready') && <Icon icon="spinner" spin theme="primary" />}
                            {item.status === 'success' && <Icon icon="check-circle" theme="warning" />}
                            {item.status === 'error' && <Icon icon="times-circle" theme="danger" />}
                            {item.status === 'onPreview' && <Icon icon="eye" theme="dark" onClick={()=>handImageData(item)} />}
                        </span>
                        <span className="file-actions ms-2">
                            <Icon icon="times" onClick={() => { onRemove(item)}}/>
                        </span>
                        {item.status === 'uploading' &&
                            <ProgressBar
                                now={item.percent || 0}
                            />
                        }
                        <EditImage show={show} img={img as UploadFile} handleClose={handleClose} />
                    </li>
                )
            })}
        </ul>
    )
}

export default UploadList;