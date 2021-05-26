export type TrackModel = {
    id: string
    external_url: string
    name: string
    add_info: {
        added_at: string
        add_user_id: string
        add_user_name: string
        add_user_external_url: string
    }
    artists: string[]
  };
  
  declare const data: TrackModel[];
  
  export default data;