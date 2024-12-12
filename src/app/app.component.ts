import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { catchError, retry } from 'rxjs/operators';
import { throwError } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  readonly BASE_URL = 'https://jsonplaceholder.typicode.com';
  // readonly BASE_URL = 'https://moviesdatabase.p.rapidapi.com/titles/random';
  posts: any;

  constructor(private http: HttpClient) {}

  getPosts() {
    this.http
      .get(this.BASE_URL + '/posts')
      .pipe(
        retry(3),
        catchError((error) => {
          console.error('Failed after 3 retries:', error);
          return throwError(() => error);
        })
      )
      .subscribe({
        next: (response) => {
          this.posts = response;
        },
        complete: () => {
          console.log('HTTP request completed');
        },
      });
  }

  createPost() {
    const newPost = {
      title: 'New Post Title',
      body: 'This is the body of the new post.',
      userId: 1,
    };

    this.http
      .post(this.BASE_URL + '/posts', newPost)
      .pipe(
        catchError((error) => {
          console.error('Error creating post:', error);
          Swal.fire('Error!', 'Failed to create the post.', 'error');
          return throwError(() => error);
        })
      )
      .subscribe({
        next: (response) => {
          Swal.fire(
            'Created!',
            'Your post has been created successfully.',
            'success'
          );
          console.log('Post created successfully:', response);
        }
      });
  }

  updatePost(postId: number) {
    const updatedPost = {
      id: postId,
      title: 'Updated Post Title',
      body: 'This is the updated body of the post.',
      userId: 1,
    };

    this.http
      .put(this.BASE_URL + '/posts/' + postId, updatedPost)
      .pipe(
        catchError((error) => {
          console.error('Error updating post:', error);
          Swal.fire('Error!', 'Failed to update the post.', 'error');
          return throwError(() => error);
        })
      )
      .subscribe({
        next: (response) => {
          Swal.fire(
            'Updated!',
            'The post has been updated successfully.',
            'success'
          );
          console.log('Post updated successfully:', response);
        }
      });
  }

  deletePost(postId: number) {
    this.http
      .delete(this.BASE_URL + '/posts/' + postId)
      .pipe(
        catchError((error) => {
          console.error('Error deleting post:', error);
          Swal.fire('Error!', 'Failed to delete the post.', 'error');
          return throwError(() => error);
        })
      )
      .subscribe({
        next: () => {
          Swal.fire('Deleted!', 'The post has been deleted.', 'success');
        }
      });
  }
}
