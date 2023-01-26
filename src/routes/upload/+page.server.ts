// svelte
import { fail } from '@sveltejs/kit';

// helpers
import { formatText, formatFileName, dateIsValid } from 'src/helpers/helpers';

// api
import { uploadFile } from 'src/api/storage';
import { insertRecords } from 'src/api/database';

export const actions = {
  default: async (event: any) => {
    const data = await event.request.formData();

    const title = data.get('title');
    const releaseDate = data.get('releaseDate');
    const coverFile = data.get('coverFile');

    const formattedTitle = formatText(title);

    if (formattedTitle.length < 1 || formattedTitle.length > 255) return fail(400, { isTitleFail: true, message: 'Title must be between 1 and 255 characters' });

    if (!releaseDate || !dateIsValid(releaseDate)) return fail(400, { isReleaseDateFail: true, message: 'Please enter a valid release date' });
    
    if (coverFile.type !== 'image/webp') return fail(400, { isCoverFileFail: true, message: 'Cover file must be in WEBP format' });

    if (!coverFile || coverFile.size === 0) return fail(400, { isCoverFileFail: true, message: 'Please upload cover file' });

    const coverFileSizeKB = Math.floor(coverFile.size / 1000);

    // if (coverFileSizeKB > 100) return fail(400, { isCoverFileFail: true, message: 'Cover file size must be 100KB or less' });

    if (coverFileSizeKB > 100) return fail(400, { isCoverFileFail: true, message: 'Cover file size must be 100KB or less' });

    const insertedBooks: any = await insertRecords('book', [{ title: formattedTitle, release_date: releaseDate }]);

    if (!insertedBooks[0]) return fail(500, { isUploadFail: true, message: 'Book upload failed :(' });

    const formattedFolderName = formatFileName(title, insertedBooks[0].id);
    const formattedCoverFileName = formatFileName(title, insertedBooks[0].id, true);

    const result = await uploadFile('book-covers', `${formattedFolderName}/${formattedCoverFileName}`, coverFile);

    if (!result) return fail(500, { isUploadFail: true, message: 'File upload failed :(' });

    return { isUploadSuccess: true, message: 'Upload successful!' };
  }
};