interface I_Profile {
  id: number,
  created_at?: string,
  user_id: string,
  is_contributor: boolean,
  book_total_count: number,
  book_reading_count: number,
  book_want_to_read_count: number,
  book_read_count: number,
  book_did_not_finish_count: number,
}

export default I_Profile;