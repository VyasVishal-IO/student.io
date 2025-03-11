"use client";

import React, { useState, useEffect } from 'react';

import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  orderBy 
} from 'firebase/firestore';

import { db } from '@/lib/firebase';

import { useAuth } from '@/context/AuthContext';

import { Textarea } from "@/components/ui/textarea";

import { Button } from "@/components/ui/button";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function ProjectContributionBox({ projectId, isTeamMember } : any) {
  const { user } = useAuth();
  const [contributions, setContributions] = useState([]);
  const [newContribution, setNewContribution] = useState('');

  useEffect(() => {
    const fetchContributions = async () => {
      const q = query(
        collection(db, 'contributions'), 
        where('projectId', '==', projectId),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      const contributionsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setContributions(contributionsList);
    };

    fetchContributions();
  }, [projectId]);

  const handleSubmitContribution = async () => {
    if (!newContribution.trim() || !isTeamMember) return;

    try {
      await addDoc(collection(db, 'contributions'), {
        projectId,
        userId: user.uid,
        userName: user.displayName || user.email,
        content: newContribution,
        createdAt: new Date()
      });
      setNewContribution('');
      // Refresh contributions
    } catch (error) {
      console.error('Error adding contribution:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Contributions</CardTitle>
      </CardHeader>
      <CardContent>
        {isTeamMember && (
          <div className="mb-6">
            <Textarea
              placeholder="Share your contribution or update"
              value={newContribution}
              onChange={(e) => setNewContribution(e.target.value)}
              className="mb-2"
            />
            <Button 
              onClick={handleSubmitContribution}
              disabled={!newContribution.trim()}
            >
              Submit Contribution
            </Button>
          </div>
        )}

        <div className="space-y-4">
          {contributions.map((contribution) => (
            <div key={contribution.id} className="flex items-start space-x-4">
              <Avatar>
                <AvatarImage src={`/user-avatars/${contribution.userId}.jpg`} />
                <AvatarFallback>
                  {contribution.userName[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{contribution.userName}</p>
                <p>{contribution.content}</p>
                <small className="text-gray-500">
                  {contribution.createdAt.toDate().toLocaleString()}
                </small>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}