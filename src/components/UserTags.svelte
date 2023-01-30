
<script lang="ts">
  let bookCollections: any = [];
  let bookCollectionIds: any = [];
  let bookCollectionTitle: string = '';
  let bookCollectionDescription: string = '';

  // profile.subscribe(async (value) => {
  //   if (!currentProfile && value) {
  //     const [
  //       bookCollectionRecords,
  //       bookCollectionBookRecords,
  //     ] = await Promise.all([
  //       getRecords(
  //         'book_collection',
  //         `id, title, total_count`,
  //         {
  //           profile_id: value.id,
  //         },
  //         {
  //           column: 'title',
  //           ascending: true
  //         },
  //       ),
  //       getRecords(
  //         'book_collection_book',
  //         `id, book_collection_id`,
  //         {
  //           profile_id: value.id,
  //           book_id: data.item.id,
  //         },
  //       ),
  //     ]);

  //     bookCollections = bookCollectionRecords;
  //     bookCollectionIds = bookCollectionBookRecords.map((bookCollectionBook: any) => bookCollectionBook.book_collection_id);
      
  //     currentProfile = value;
  //   } else if (currentProfile) {
  //     currentProfile = value;
  //   }
  // });

  // const handleAddToCollection = async (bookCollection: any) => {
  //   isLoading = true;

  //   const bookCollectionBookData: any = {
  //     profile_id: currentProfile.id,
  //     book_id: data.item.id,
  //     book_collection_id: bookCollection.id,
  //   }

  //   const updatedBookCollectionData: any = {
  //     total_count: bookCollection.total_count + 1,
  //   };

  //   const [
  //     newBookCollectionBookRecords,
  //     latestBookCollectionRecords
  //   ] = await Promise.all([
  //     insertRecords('book_collection_book', [bookCollectionBookData]),
  //     updateRecords('book_collection', [updatedBookCollectionData], { id: bookCollection.id }),
  //   ]);

  //   const index = bookCollections.findIndex((previousBookCollection: any) => previousBookCollection.id === bookCollection.id);
  //   bookCollections[index] = latestBookCollectionRecords[0];
  //   bookCollectionIds = [ ...bookCollectionIds, bookCollection.id ];

  //   isLoading = false;
  // }

  // const handleRemoveFromCollection = async (bookCollection: any) => {
  //   isLoading = true;

  //   const updatedBookCollectionData: any = {
  //     total_count: bookCollection.total_count - 1,
  //   };

  //   const [
  //     deletedBookCollectionBookRecords,
  //     latestBookCollectionRecords
  //   ] = await Promise.all([
  //     deleteRecords('book_collection_book', { book_collection_id: bookCollection.id, book_id: data.item.id }),
  //     updateRecords('book_collection', [updatedBookCollectionData], { id: bookCollection.id }),
  //   ]);

  //   const index = bookCollections.findIndex((previousBookCollection: any) => previousBookCollection.id === bookCollection.id);
  //   bookCollections[index] = latestBookCollectionRecords[0];
  //   bookCollectionIds = bookCollectionIds.filter((bookCollectionBookId: number) => bookCollectionBookId !== bookCollection.id);

  //   isLoading = false;
  // }
</script>


<!--
  {#if currentProfile}
    <div class="w-full flex flex-col gap-4 sm:max-w-[200px]">
      <Card>
        <div class="w-full flex justify-between items-center">
          <Heading label="Collections" />
          <EditButton handleClick={() => showCollectionsModal = true} />
        </div>
        <Modal
          label="Collections"
          bind:showModal={showCollectionsModal}
          handleSubmit={() => showCollectionsModal = false}
          handleCancel={() => showCollectionsModal = false}
        >
          {#if bookCollectionIds.length > 0}
            <SuccessCard>
              <p>You added this book to {bookCollectionIds.length} {bookCollectionIds.length === 1 ? 'collection' : 'collections'}</p>
            </SuccessCard>
          {/if}
          {#if profileBook}
            <div class="flex flex-col gap-2">
              <TextInput
                placeholder="Title (max. 40 characters)"
                bind:value={bookCollectionTitle}
                maxLength={40}
              />
              <TextareaInput
                placeholder="Description (max. 400 characters)"
                maxLength={400}
                bind:value={bookCollectionDescription}
              />
              <Button
                label="Add Collection"
                handleClick={async () => console.log(bookCollectionTitle)}
                isDisabled={
                  isLoading ||
                  (bookCollectionTitle === '')
                }
              />
            </div>
            {#if bookCollections.length > 0}
              <div class="w-full grid gap-2">
                {#each bookCollections as bookCollection}
                  <div class="flex gap-2 items-center">
                    {#if bookCollectionIds.indexOf(bookCollection.id) !== -1}
                      <SuccessCard>
                        <p class="flex-grow">{bookCollection.title} ({bookCollection.total_count})</p>
                      </SuccessCard>
                      <MinusButton handleClick={async () => await handleRemoveFromCollection(bookCollection)} isDisabled={isLoading} />
                    {:else}
                      <p class="flex-grow">{bookCollection.title} ({bookCollection.total_count})</p>
                      <PlusButton handleClick={async () => await handleAddToCollection(bookCollection)} isDisabled={isLoading} />
                    {/if}
                  </div>
                {/each}
              </div>
            {/if}
          {:else}
            <InfoCard>
              <p class="dark:text-white">You can start adding this book to your collections after marking a status</p>
            </InfoCard>
          {/if}
        </Modal>
      </Card>
    </div>
</div> -->