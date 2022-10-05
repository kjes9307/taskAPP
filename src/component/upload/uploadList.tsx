import { FC,useState } from "react";
import ReactCrop , {Crop,PixelCrop} from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { UploadFile } from './index'
import Icon from 'component/Icon'
import {ProgressBar,Modal,Button} from 'react-bootstrap'
import './style.scss'

interface UploadListProps {
    fileList: UploadFile[];
    onRemove: (_file: UploadFile) => void;
}
const EditImage = (props:{img:UploadFile,show:boolean,handleClose:()=>void}) => {
    const {
        img,
        show,
        handleClose
    } = props
    const [crop, setCrop] = useState<Crop>({
        unit: '%',
        x: 25,
        y: 25,
        width: 50,
        height: 50
      })
    const onHandleCrop = (e:PixelCrop) =>{
        setCrop(e)
        console.log(e)
    } 
    return (
      <>
        <Modal show={show} onHide={handleClose}>
          <Modal.Body>
          <ReactCrop crop={crop} aspect={4/3} onChange={e => onHandleCrop(e)}>
            <img src={img?.data_url} className="crop-img" />
          </ReactCrop>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
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