import ServerLogic from './DataUploader';

export default function dataLeecher(data: any){
    //here you can subscribe for data
   ServerLogic.proceed(data);
}