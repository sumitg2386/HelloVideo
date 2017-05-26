var VideoCaptureUtil = new function () {
    // Captures the videeos
    this.captureVideo = function () {
        navigator.device.capture.captureVideo(
            VideoCaptureUtil.videoCaptureSuccess,
            VideoCaptureUtil.videoCaptureError,
            {
                limit: 1,
                duration: 30
            }
        );
    };

    this.videoCaptureSuccess = function (mediaFiles) {
        // Wrap this below in a ~100 ms timeout on Android if
        // you just recorded the video using the capture plugin.
        // For some reason it is not available immediately in the file system.
		alert("videoCaptureSuccess");
		alert(mediaFiles);
        var file = mediaFiles[0];
		//VideoCaptureUtil.uploadFile(file);
		alert(file);
        var videoFileName = 'video-name-here'; // I suggest a uuid
		alert("compress");
		alert(VideoEditorOptions.OutputFileType.MPEG4);
        VideoEditor.transcodeVideo(
            VideoCaptureUtil.videoTranscodeSuccess,
            VideoCaptureUtil.videoTranscodeError,
            {
                fileUri: file.fullPath,
                outputFileName: videoFileName,
                outputFileType: VideoEditorOptions.OutputFileType.MPEG4,
                optimizeForNetworkUse: VideoEditorOptions.OptimizeForNetworkUse.YES,
                saveToLibrary: true,
                maintainAspectRatio: true,
                width: 640,
                height: 640,
                videoBitrate: 1000000, // 1 megabit
                audioChannels: 2,
                audioSampleRate: 44100,
                audioBitrate: 128000, // 128 kilobits
                progress: function (info) {
                    console.log('transcodeVideo progress callback, info: ' + info);
                }
            }
        );
		
		/*VideoEditor.createThumbnail(
			VideoCaptureUtil.createThumbnailSuccess,
			VideoCaptureUtil.createThumbnailError,
			{
				fileUri: file.fullPath,
				outputFileName: videoFileName,
				atTime: 2,
				width: 320,
				height: 480,
				quality: 100
			}
		);*/
		
		
    };
	
	this.createThumbnailSuccess = function(result) {
		// result is the path to the jpeg image on the device
		console.log('createThumbnailSuccess, result: ' + result);
	}
	
	this.createThumbnailError = function (error) {
        console.log('createThumbnailSuccess, err: ' + error);
		alert('VcreateThumbnailSuccess, err: ' + error);
    };

    this.videoCaptureError = function (error) {
        console.log('Video recording, err: ' + error);
		alert('Video recording, err: ' + error);
    };

    this.videoTranscodeSuccess = function (result) {
        // result is the path to the transcoded video on the device
        console.log('videoTranscodeSuccess, result: ' + result);
		alert('videoTranscodeSuccess, result: ' + result);

        //VideoCaptureUtil.uploadFileUrl(result);
    };

    this.videoTranscodeError = function (err) {
        console.log('videoTranscodeError, err: ' + err);
		alert('videoTranscodeError, err: ' + err);
    };

    // Upload files to server
    this.uploadFile = function (mediaFile) {
		alert("uploadFile");
        var ft = new FileTransfer(),
            path = mediaFile.fullPath,
            name = mediaFile.name;
        var fileUploadOptions;
        fileUploadOptions = new FileUploadOptions();
        fileUploadOptions.fileName = name;
        //TODO: Unique key of file upload
        fileUploadOptions.fileKey = "file";

        ft.upload(path,
            "http://192.168.0.122/bestpractice/api/bp/UploadVideo",
            function (result) {
                alert("Upload success: " + result.responseCode);
            },
            function (error) {
                alert("Error uploading file " + path + ": " + error.code);
            },
            fileUploadOptions);
    };
	
	// Upload files to server
    this.uploadFileUrl = function (fileURI) {
		alert("uploadFile");
        var ft = new FileTransfer(),
            path = fileURI,
            name = fileURI.substr(fileURI.lastIndexOf('/') + 1);;
        var fileUploadOptions;
        fileUploadOptions = new FileUploadOptions();
        fileUploadOptions.fileName = name;
        //TODO: Unique key of file upload
        fileUploadOptions.fileKey = "file";

        ft.upload(path,
            "http://192.168.0.122/bestpractice/api/bp/UploadVideo",
            function (result) {
                alert("Upload success: " + result.responseCode);
            },
            function (error) {
                alert("Error uploading file " + path + ": " + error.code);
            },
            fileUploadOptions);
    };

    this.chooseVideo = function () {
        function onSuccess(fileURI) {
			VideoCaptureUtil.uploadFileUrl(fileURI);
            window.resolveLocalFileSystemURL(fileURI,
                function (fileEntry) {
                    console.log(fileEntry.toURL());
                    alert(fileEntry.toURL());
					VideoCaptureUtil.uploadFileUrl(fileEntry.toURL());
                },
                function () { });
        }       

        function onFail(message) {
            //alert('No picture choosen');
        }

        navigator.camera.getPicture(onSuccess, onFail, {
            limit: 1,
            mediaType: Camera.MediaType.VIDEO,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        });
    };
};
