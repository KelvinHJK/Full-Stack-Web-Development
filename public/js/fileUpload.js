FilePond.registerPlugin(
  FilePondPluginImagePreview,
  FilePondPluginImageResize,
  FilePondPluginFileEncode
);

FilePond.setOptions({
  stylePanelAspectRatio: 100 / 150,
  imageResizeTargetWidth: 150,
  imageResizeTargetHeight: 100,
});

FilePond.parse(document.body);

// FilePond.registerPlugin(FilePondPluginImagePreview);
// FilePond.registerPlugin(FilePondPluginImageResize);
// FilePond.registerPlugin(FilePondPluginFileEncode);
// const inputElement = document.querySelector('input[type="file"]');
// const pond = FilePond.create(inputElement);
// FilePond.parse(document.body);
